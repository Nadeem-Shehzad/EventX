import { INestApplication, ValidationPipe } from "@nestjs/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection } from "mongoose";
import { UserService } from "../../user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import request from 'supertest';

import { registerTestUser } from "./user.helper";
import { ThrottlerGuard, ThrottlerModule, ThrottlerStorage } from "@nestjs/throttler";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "../../user.module";
import { PassThrough } from 'stream';
import { EventService } from "src/modules/event/event.service";

const redisStore = new Map<string, string>();

jest.mock('ioredis', () => {
   return {
      __esModule: true,
      default: jest.fn().mockImplementation(() => ({
         set: jest.fn().mockImplementation((key, value) => {
            redisStore.set(key, String(value)); // Store as string
            return 'OK';
         }),
         get: jest.fn().mockImplementation((key) => {
            return redisStore.get(key) || null; // Return value or null
         }),
         del: jest.fn().mockImplementation((key) => redisStore.delete(key)),
         setex: jest.fn(),
         expire: jest.fn(),
         ttl: jest.fn(),
         exists: jest.fn(),
      })),
   };
});


jest.mock('cloudinary', () => ({
   v2: {
      config: jest.fn(),
      uploader: {
         upload_stream: jest.fn().mockImplementation((options, callback) => {
            // Create a real Node.js PassThrough stream
            const mockStream = new PassThrough();

            // When the stream finishes (Multer is done piping), trigger the callback
            mockStream.on('finish', () => {
               if (callback) {
                  callback(null, {
                     public_id: 'eventx/events/test_id',
                     secure_url: 'https://res.cloudinary.com/test-url.jpg',
                  });
               }
            });

            return mockStream;
         }),
         destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
      },
   },
}));


jest.setTimeout(30000);

let app: INestApplication;
let mongoServer: MongoMemoryServer;
let connection: Connection;
let userService: UserService;
let throttlerStorage: any;


// --- Setup Nest app + MongoMemoryServer
beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create({
      instance: {
         // Increase startup timeout to 30 seconds (30000ms)
         launchTimeout: 30000
      }
   });
   const mongoUri = mongoServer.getUri();

   const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
         // 1. Configure ConfigModule properly instead of mocking the service
         ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true, // Don't look at .env file
            load: [
               () => ({
                  MONGO_URI: mongoUri,
                  app_url: 'http://localhost:3000',
                  // Provide BOTH keys to be safe (depending on what your JwtModule uses)
                  JWT_SECRET: 'test-access-secret',
                  JWT_ACCESS_SECRET: 'test-access-secret',
                  JWT_REFRESH_SECRET: 'test-refresh-secret',
                  JWT_REFRESH_EXPIRES: '900s',

                  CLOUDINARY_NAME: 'test_cloud',
                  CLOUDINARY_KEY: 'test_key',
                  CLOUDINARY_SECRET: 'test_secret',
               }),
            ],
         }),
         MongooseModule.forRootAsync({
            useFactory: async () => ({ uri: mongoUri }),
         }),
         ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10, // Global default (your controller overrides this to 3)
         }]),
         AuthModule,
         UserModule
      ],
      providers: [
         // 2. ADD THIS PROVIDER BLOCK
         // This forces the test module to actually USE the guard globally
         {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
         },
         {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
         },
      ]
   })
      .overrideProvider(EventService)
      .useValue({
         findById: jest.fn(),
         findEventOwner: jest.fn(),
         // Add other methods if AuthModule actually calls them
      })
      .compile();

   app = moduleRef.createNestApplication();

   // Apply validation pipe if your controller relies on it for DTO validation
   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

   app.useGlobalFilters({
      catch(exception: any, host: any) {
         const ctx = host.switchToHttp();
         const response = ctx.getResponse();
         const status = exception.getStatus ? exception.getStatus() : 500;

         // Log the error for you to see in terminal
         if (status === 500) console.error('REAL ERROR:', exception);

         response.status(status).json(
            exception.response || { message: exception.message, statusCode: status }
         );
      }
   });
   //app.getHttpAdapter().getInstance().set('trust proxy', true);
   throttlerStorage = moduleRef.get<ThrottlerStorage>(ThrottlerStorage);
   await app.init();

   connection = moduleRef.get(getConnectionToken());
   userService = moduleRef.get<UserService>(UserService);
});

// --- Cleanup Mongo + App
afterAll(async () => {
   if (connection) await connection.close();
   if (mongoServer) await mongoServer.stop();
   if (app) await app.close();
});

// --- Clear collections after each test
afterEach(async () => {
   if (connection) {
      const collections = connection.collections;
      for (const key in collections) {
         await collections[key].deleteMany({});
      }
   }

   if (throttlerStorage && throttlerStorage.storage) {
      throttlerStorage.storage.clear();
   }
});



// ================= TESTS =================

describe('UserModule - User Profile', () => {
   let token: string;
   let userId: string;

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('GET /users/profile → should return logged-in user profile', async () => {
      const res = await request(app.getHttpServer())
         .get('/user/profile')
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      // console.log(`token -> ${token}`);   
      // console.log(res.status, res.body);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(email);
   });

   it('GET /users/profile → should give Unauhtorized Error - if no token provided', async () => {
      const res = await request(app.getHttpServer())
         .get('/user/profile')
         .expect(401);

      expect(res.body.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
   });
});


describe('UserModule - Get User By ID', () => {
   let token: string;
   let userId: string;

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'admin';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      userId = user._id;

      //console.log('userID -> ',userId);

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('should give user data on ID based.', async () => {

      const res = await request(app.getHttpServer())
         .get(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      expect(res.body.success).toBe(true);
   });

   it('should give Error of NotFound - if id not valid', async () => {

      userId = '6946bb33d16c4c03c0f00000';

      const res = await request(app.getHttpServer())
         .get(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(404);

      expect(res.statusCode).toBe(404);
   });
})


describe('UserModule - Update Profile', () => {
   let token: string;
   let userId: string;

   const name = 'nadeem';
   const email = 'nadeem@test.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      const user = await registerTestUser(app, { name, email, password });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('Should Update User Profile.', async () => {

      const dataToUpdate = {
         name: 'Nadeem Shahzad'
      }

      const res = await request(app.getHttpServer())
         .put(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .send(dataToUpdate)
         .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.message).toBe('Profile updated successfully');
   });

   it('should give Error of Forbidden - if ID not valid', async () => {

      userId = '6946bb33d16c4c03c0f00000';
      const dataToUpdate = {
         name: 'Nadeem Shahzad'
      }

      const res = await request(app.getHttpServer())
         .put(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .send(dataToUpdate)
         .expect(403);

      expect(res.statusCode).toBe(403);
   });
});


describe('UserModule - Delete Account', () => {
   let token: string;
   let userId: string;

   const name = 'nadeem';
   const email = 'nadeem@test.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      const user = await registerTestUser(app, { name, email, password });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('Should Delete User Account.', async () => {

      const res = await request(app.getHttpServer())
         .delete(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.message).toBe('Account deleted successfully');
   });

   it('should give Error of Forbidden - if ID not valid', async () => {

      userId = '6946bb33d16c4c03c0f00000';

      const res = await request(app.getHttpServer())
         .delete(`/user/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(403);

      expect(res.statusCode).toBe(403);
   });
});


describe('UserModule - Gel All Users', () => {
   let token: string;
   let userId: string;

   const name = 'nadeem';
   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'admin';

   beforeEach(async () => {
      const user = await registerTestUser(app, { name, email, password, role });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('Should Give All Users Data', async () => {

      const res = await request(app.getHttpServer())
         .get(`/user/`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.statusCode).toBe(200);
   });
});


describe('Admin - UserModule - Update Profile', () => {
   let token: string;
   let userId: string;

   const name = 'nadeem';
   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'admin';

   beforeEach(async () => {
      const user = await registerTestUser(app, { name, email, password, role });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('Admin - Should Update User Profile.', async () => {

      const dataToUpdate = {
         name: 'Nadeem Shahzad'
      }

      const res = await request(app.getHttpServer())
         .put(`/user/${userId}/admin`)
         .set('Authorization', `Bearer ${token}`)
         .send(dataToUpdate)
         .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.message).toBe('Profile updated successfully');
   });

   it('Admin - should give Error of Forbidden - if ID not valid', async () => {

      userId = '6946bb33d16c4c03c0f00000';
      const dataToUpdate = {
         name: 'Nadeem Shahzad'
      }

      const res = await request(app.getHttpServer())
         .put(`/user/${userId}/admin`)
         .set('Authorization', `Bearer ${token}`)
         .send(dataToUpdate)
         .expect(404);

      expect(res.statusCode).toBe(404);
   });
});


describe('Admin - UserModule - Delete Account', () => {
   let token: string;
   let userId: string;

   const name = 'nadeem';
   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'admin';

   beforeEach(async () => {
      const user = await registerTestUser(app, { name, email, password, role });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });

   it('Admin - Should Delete User Account.', async () => {

      const res = await request(app.getHttpServer())
         .delete(`/user/${userId}/admin`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.message).toBe('Account deleted successfully');
   });

   it('should give Error of Forbidden - if ID not valid', async () => {

      userId = '6946bb33d16c4c03c0f00000';

      const res = await request(app.getHttpServer())
         .delete(`/user/${userId}/admin`)
         .set('Authorization', `Bearer ${token}`)
      expect(404);

      expect(res.statusCode).toBe(404);
   });
});