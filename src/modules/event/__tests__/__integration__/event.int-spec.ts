import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ThrottlerGuard, ThrottlerModule, ThrottlerStorage } from "@nestjs/throttler";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, Types } from "mongoose";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { PassThrough } from "stream";
import { EventModule } from "../../event.module";
import { EventService } from "../../event.service";
import { ImageQueueModule } from "src/queue/event-image/image.queue.module";
import { MockQueueModule } from "src/modules/event/__tests__/__integration__/mock-queue";
import request from 'supertest';
import { eventsList, singleEvent } from "./fake-events-list";
import { registerTestUser } from "./auth.helper";


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
let eventService: EventService;
let throttlerStorage: any;


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
         UserModule,
         EventModule
      ],
      providers: [
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
      .overrideModule(ImageQueueModule)
      .useModule(MockQueueModule)
      .compile();

   app = moduleRef.createNestApplication();

   app.setGlobalPrefix('v1');

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
   throttlerStorage = moduleRef.get<ThrottlerStorage>(ThrottlerStorage);
   await app.init();

   connection = moduleRef.get(getConnectionToken());
   eventService = moduleRef.get<EventService>(EventService);
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



describe('Event Module - Get All Events', () => {

   const insertEvents = async () => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId('6946bb33d16c4c03c0f00000');

      await eventCollection.insertMany(eventsList(organizerId));
   };

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });


   it('GET /event → should return only published & non-deleted events', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events?page=1&limit=10')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(2);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 1',
         'Published Event 2',
      ]);

      expect(res.body.data.meta).toEqual({
         total: 2,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Events By Filters', () => {

   const insertEvents = async () => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId('6946bb33d16c4c03c0f00000');

      await eventCollection.insertMany(eventsList(organizerId));
   };

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });


   it('GET /filter → should return only published & non-deleted events based on category', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events/filter?category=coding')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(1);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 1,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });


   it('GET /filter → should return only published & non-deleted events based on tags', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events/filter?tags=node')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(1);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 1'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 1,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });


   it('GET /filter → should return only published & non-deleted events based on city', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events/filter?city=Kasur')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(1);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 1,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });


   it('GET /filter → should return only published & non-deleted events based on Search', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events/filter?search=Published Event 2')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(1);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 1,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Free Events', () => {

   const insertEvents = async () => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId('6946bb33d16c4c03c0f00000');

      await eventCollection.insertMany(eventsList(organizerId));
   };

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });


   it('GET /free → should return only published & non-deleted & free events', async () => {

      await insertEvents();

      const res = await request(app.getHttpServer())
         .get('/v1/events/free')
         .expect(200);

      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(2);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 1',
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 2,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Organizer Events', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /organizer/:id → should return only published & non-deleted based on organizerId', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/organizer/${organizerId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(3);

      // const titles = res.body.data.events.map(e => e.title);
      // expect(titles).toEqual([
      //    'Published Event 1',
      //    'Published Event 2',
      //    'Draft Event',
      // ]);

      expect(res.body.data.meta).toEqual({
         total: 3,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
});


describe('Event Module - Get Organizer Own Events', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /organizer/:id → should return only published & non-deleted based on organizerId', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/organizer`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(4);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual(expect.arrayContaining([
         'Published Event 1',
         'Published Event 2',
         'Draft Event',
         'Deleted Event'
      ]));

      expect(res.body.data.meta).toEqual({
         total: 4,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Events By Status', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /filter-by-status → should return only published & non-deleted based on status', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/filter-by-status?status=published&page=1&limit=10`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(2);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 1',
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 2,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Events By Status', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /filter-by-status → should return only published & non-deleted based on status', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/filter-by-status?status=published&page=1&limit=10`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data.events).toHaveLength(2);

      const titles = res.body.data.events.map(e => e.title);
      expect(titles).toEqual([
         'Published Event 1',
         'Published Event 2'
      ]);

      expect(res.body.data.meta).toEqual({
         total: 2,
         page: 1,
         limit: 10,
         totalPages: 1,
      });
   });
})


describe('Event Module - Get Status Summary', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /status-summary → should return status based summary', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/status-summary`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data).toEqual([
         {
            total: 1,
            status: 'draft'
         },
         {
            total: 2,
            status: 'published'
         }
      ]);
   });
})


describe('Event Module - Get Upcoming Events', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const insertEvents = async (id: string) => {
      const eventCollection = connection.collection('events');
      const organizerId = new Types.ObjectId(id);
      await eventCollection.insertMany(eventsList(organizerId));
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

      //console.log('Organizer Response ----> ', user);
      //console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
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


   it('GET /upcoming-events → should return upcoming events', async () => {

      await insertEvents(organizerId);

      const res = await request(app.getHttpServer())
         .get(`/v1/events/upcoming-events`)
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      //console.log('token --> ', token);
      //console.log(res.status, res.body);

      expect(res.body.data.events.length).toEqual(0);
   });
})


describe('Event Module - Get Cancel Events', () => {

   const email = 'nadeem@test.com';
   const password = 'Aa$123456';
   const role = 'organizer';

   const setupEvent = async (userId: string) => {
      const eventCollection = connection.collection('events');
      const organizerObjectId = new Types.ObjectId(userId);
      
      // Insert one specific event
      const res = await eventCollection.insertOne(singleEvent(organizerObjectId));

      console.log('////////////');
      console.log(res);
      console.log('////////////');

      return res.insertedId.toString();
   };

   //const organizerId = '6946bb33d16c4c03c0f00000';
   let organizerId: string;
   let token: string;
   let eventId: string;

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password, role });
      organizerId = user._id;

     // console.log('Organizer Response ----> ', user);
     // console.log('Organizer ID ----> ', organizerId);

      const loginRes = await request(app.getHttpServer())
         .post('/v1/auth/login')
         .send({ email, password })
         .expect(201);

      token = loginRes.body.data.token;
      eventId = await setupEvent(organizerId);
   });


   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }
   });


   it('POST /cancel/:id → should cancel event', async () => {

      const res = await request(app.getHttpServer())
         .post(`/v1/events/cancel/${eventId}`)
         .set('Authorization', `Bearer ${token}`)
         //.expect(200);

      console.log('token --> ', token);
      console.log(res.status, res.body);

   });
})