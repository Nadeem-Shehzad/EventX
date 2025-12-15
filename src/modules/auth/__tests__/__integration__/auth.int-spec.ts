import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth.module';
import { forgotPasswordTestUser, loginTestUser, registerTestUser } from './auth.helper';
import { UserService } from 'src/modules/user/user.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';


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
      ],
      providers: [
         // 2. ADD THIS PROVIDER BLOCK
         // This forces the test module to actually USE the guard globally
         {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
         },
      ]
   }).overrideProvider(MailerService).useValue({ sendMail: jest.fn().mockResolvedValue(true) })
      .compile();

   app = moduleRef.createNestApplication();

   // Apply validation pipe if your controller relies on it for DTO validation
   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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

describe('AuthModule - Registration', () => {
   it('should register a user successfully', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/register')
         .send({ name: 'Test User', email: 'user@test.com', password: 'Aa$123456' })
         .expect(201);

      const user = await connection.collection('users').findOne({ email: 'user@test.com' });

      expect(user).not.toBeNull();
      expect(user?.email).toBe('user@test.com');
   });

   it('should Throw conflictException - If Email already exists.', async () => {

      await registerTestUser(app, { name: 'Test User', email: 'user@test.com', password: 'Aa$123456' });

      const res = await request(app.getHttpServer())
         .post('/auth/register')
         .send({ name: 'Test User', email: 'user@test.com', password: 'Aa$123456' })
         .expect(409);

      expect(res.status).toBe(409);
   });

   it('should throttle requests after 5 attempts', async () => {
      for (let i = 0; i < 5; i++) {
         await request(app.getHttpServer())
            .post('/auth/register')
            .send({ name: 'Test User', email: 'user@test.com', password: 'Aa$123456' });
      }

      const res = await request(app.getHttpServer())
         .post('/auth/register')
         .send({ name: 'Test User', email: 'user@test.com', password: 'Aa$123456' });

      expect(res.status).toBe(429);
   });
});


describe('AuthModule - Login', () => {

   beforeEach(async () => {
      await registerTestUser(app, { email: 'user@test.com', password: 'Aa$123456' });
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }

      if (throttlerStorage.storage) {
         throttlerStorage.storage.clear();
      }
   });

   it('should be able to login with registered user', async () => {

      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'user@test.com', password: 'Aa$123456' })
         .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');

      expect(res.body.token.split('.')).toHaveLength(3);
      expect(res.body.refreshToken.split('.')).toHaveLength(3);
   });

   it('should fail login with invalid password', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'user@test.com', password: 'Aa$112233' })
         .expect(401);

      expect(res.body.message).toBe('Invalid Password!');
   });

   it('should fail login for non-existent user', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'ghost@test.com', password: 'wrongpassword' })
         .expect(404); // Changed from 401 to 404 based on your code (NotFoundException)

      expect(res.body.message).toBe('User not Registered!');
   });

   it('should throttle requests after 5 attempts', async () => {

      for (let i = 0; i < 5; i++) {
         await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'Aa$123456' })
      }

      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'user@test.com', password: 'Aa$123456' });

      expect(res.status).toBe(429);
   });
});


describe('AuthModule - Change Password', () => {
   let token: string;
   let userId: string;

   const oldPassword = 'OldPass123!';
   const newPassword = 'NewPass123!';

   const email = 'change@test.com';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email: 'change@test.com', password: oldPassword });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'change@test.com', password: oldPassword })
         .expect(201);

      token = loginRes.body.token;
   });

   afterEach(async () => {
      if (connection) {
         const collections = connection.collections;
         for (const key in collections) {
            await collections[key].deleteMany({});
         }
      }

      if (throttlerStorage.storage) {
         throttlerStorage.storage.clear();
      }
   });


   it('should change password successfully', async () => {
      const payload = {
         currentPassword: oldPassword,
         newPassword,
         confirmPassword: newPassword,
      };

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send(payload);

      expect(res.status).toBe(201);
      expect(res.text).toBe('Password Changed Successfully.');
   });

   it('should fail if user not found', async () => {
      const payload = {
         currentPassword: oldPassword,
         newPassword,
         confirmPassword: newPassword,
      };

      await connection.collection('users').deleteOne({ email });

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send(payload)
         .expect(404);

      expect(res.body.message).toBe('User not Found.');
   });

   it('should fail if current password is incorrect', async () => {
      const payload = {
         currentPassword: 'WrongPass!',
         newPassword,
         confirmPassword: newPassword,
      };

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send(payload);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid current password.');
   });

   it('should fail if new password equals current password', async () => {
      const payload = {
         currentPassword: oldPassword,
         newPassword: oldPassword,
         confirmPassword: oldPassword,
      };

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send(payload);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('New password must be different from current password.');
   });

   it('should fail if new and confirm passwords do not match', async () => {
      const payload = {
         currentPassword: oldPassword,
         newPassword,
         confirmPassword: 'Mismatch123!',
      };

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .set('Authorization', `Bearer ${token}`)
         .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('New and Confirm password are not same.');
   });

   it('should fail without JWT token', async () => {
      const payload = {
         currentPassword: oldPassword,
         newPassword,
         confirmPassword: newPassword,
      };

      const res = await request(app.getHttpServer())
         .post('/auth/change-password')
         .send(payload);

      expect(res.status).toBe(401);
   });
});


describe('AuthModule - logout', () => {
   let token: string;
   const email = 'nadeem@gmail.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password });
      const loginRes = await loginTestUser(app, { email, password });
      token = loginRes.body.token;
   });

   it('should logout user ', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/logout')
         .set('Authorization', `Bearer ${token}`)
         .expect(201)

      expect(res.body.loggedOut).toBe(true);

      const user = await connection.collection('users').findOne({ email });

      expect(user).not.toBeNull();
      expect(user?.refreshToken).toBeFalsy();
   });
});


describe('AuthModule - RefreshToken', () => {
   let rftoken: string;
   const email = 'nadeem@gmail.com';
   const password = 'Aa$123456';

   let fakeRfToken = 'ajkdhkasjdhaskdhkasdj.djhfsdkjfhskdfjhsdjf.kjhfskdjfhsdkjh';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password });
      const loginRes = await loginTestUser(app, { email, password });

      rftoken = loginRes.body.refreshToken;
   });

   it('should Generate Access Token', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/refresh')
         .send({ refresh_token: rftoken })
         .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');

      expect(res.body.access_token.split('.')).toHaveLength(3);
      expect(res.body.refresh_token.split('.')).toHaveLength(3);
   });

   it('should throw Unauthorized - If Invalid refresh token', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/refresh')
         .send({ refresh_token: fakeRfToken })
         .expect(401);

      expect(res.status).toBe(401);
   });
});


describe('AuthModule - Verify Email', () => {
   let token: string;
   const email = 'nadeem@gmail.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password });
      const loginRes = await loginTestUser(app, { email, password });

      token = loginRes.body.token;
   });

   it('Should Verify User Email', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/verify-email')
         .query({ token })
         .expect(201);

      expect(res.body.message).toEqual('Email verified successfully.');
   });

   it('should fail if user not found', async () => {

      await connection.collection('users').deleteOne({ email });

      const res = await request(app.getHttpServer())
         .post('/auth/verify-email')
         .query({ token })
         .expect(404);

      expect(res.body.message).toBe('User not found.');
   });

   it('should Notify - If Email already Verified.', async () => {

      await connection.collection('users').findOneAndUpdate(
         { email: 'user@test.com' },
         { $set: { isVerified: true } }
      );

      const res = await request(app.getHttpServer())
         .post('/auth/verify-email')
         .query({ token })
         .expect(201);

      expect(res.body.message).toBe('Email verified successfully.');
   });
});


describe('ForgotPassword', () => {
   const email = 'forgot@gmail.com';
   const password = 'Aa$123456';

   beforeEach(async () => {
      await registerTestUser(app, { email, password });
   });

   it('Should send reset password token successfully', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/forgot-password')
         .send({ email })
         .expect(201);

      // Check response
      expect(res.body.token).toBeDefined();

      // Check Redis
      // Use the Correct Injection Token: getRedisToken('default')
      // const redisClient = app.get(getRedisToken('default'));

      // Since we used the Smart Mock, this will actually find the key
      // const redisValue = await redisClient.get(`fp:${res.body.token}`);
      // expect(redisValue).toBeDefined();

      // Check Mailer
      const mailerService = app.get(MailerService);
      expect(mailerService.sendMail).toHaveBeenCalledWith(
         expect.objectContaining({
            to: email,
            subject: 'Reset Your Password',
         })
      );
   });

   it('Should fail if user does not exist', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/forgot-password')
         .send({ email: 'unknown@domain.com' })
         .expect(404);

      expect(res.body.message).toBe('User not Found.');
   });
});


describe('AuthModule - ResetPassword', () => {
   const email = 'nadeem@gmail.com';
   const password = 'Aa$123456';

   let token: string;
   const newPassword = 'Aa$112233';
   const confirmPassword = 'Aa$112233';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email, password });
      const res = await forgotPasswordTestUser(app, { email });
      token = res.body.token;
   });

   it('Should Reset Password', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/reset-password')
         .send({ token, newPassword, confirmPassword })
         .expect(201);

      expect(res.body.message).toEqual('Password reset successfully.');
   });

   it('Should Throw BadRequest - If New and Confirm Password are not same', async () => {
      const newPassword = 'Aa$112233';
      const confirmPassword = 'Aa$111222';
      const res = await request(app.getHttpServer())
         .post('/auth/reset-password')
         .send({ token, newPassword, confirmPassword })
         .expect(400);

      expect(res.body.message).toEqual('Passwords do not match.');
   });

   it('Should Throw BadRequest - If Token is Invalid', async () => {

      const token = 'aghsjashgdajhsdg.dsjhfksdjhfskdjfh.asjhfkjhakfjhsa';
      const newPassword = 'Aa$112233';
      const confirmPassword = 'Aa$112233';

      const res = await request(app.getHttpServer())
         .post('/auth/reset-password')
         .send({ token, newPassword, confirmPassword })
         .expect(400);

      expect(res.body.message).toEqual('Invalid or expired token.');
   });

   it('Should Throw NotFound - If User not Found', async () => {

      await connection.collection('users').deleteOne({ email });

      const res = await request(app.getHttpServer())
         .post('/auth/reset-password')
         .send({ token, newPassword, confirmPassword })
         .expect(404);

      expect(res.body.message).toEqual('User not found.');
   });
});