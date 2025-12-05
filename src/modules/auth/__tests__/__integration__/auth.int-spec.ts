import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth.module';
import { registerTestUser } from './auth.helper';
import { UserService } from 'src/modules/user/user.service';


// ---- Mock Redis safely
jest.mock('ioredis', () => {
   return {
      __esModule: true,
      default: jest.fn().mockImplementation(() => ({
         get: jest.fn(),
         set: jest.fn(),
         del: jest.fn(),
      })),
   };
});

jest.setTimeout(30000);

// ---- Top level variables
let app: INestApplication;
let mongoServer: MongoMemoryServer;
let connection: Connection;
let userService: UserService;

// --- Setup Nest app + MongoMemoryServer
beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   const mongoUri = mongoServer.getUri();

   const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
         ConfigModule.forRoot({ isGlobal: true }),
         MongooseModule.forRootAsync({
            useFactory: async () => ({ uri: mongoUri }),
         }),
         AuthModule,
      ],
   })
      .overrideProvider(MailerService)
      .useValue({ sendMail: jest.fn().mockResolvedValue(true) })
      .compile();

   app = moduleRef.createNestApplication();
   app.useGlobalPipes(new ValidationPipe());
   await app.init();

   connection = moduleRef.get(getConnectionToken());
   userService = moduleRef.get<UserService>(UserService);
});

// --- Cleanup Mongo + App
afterAll(async () => {
   await connection.close();
   if (mongoServer) await mongoServer.stop();
   if (app) await app.close();
});

// --- Clear collections after each test
afterEach(async () => {
   const collections = connection.collections;
   for (const key in collections) {
      await collections[key].deleteMany({});
   }
});



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
});


describe('AuthModule - Login', () => {
   it('should be able to login with registered user', async () => {
      const user = await registerTestUser(app, { email: 'user@test.com' });

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
      const user = await registerTestUser(app, { email: 'user@test.com', password: 'Aa$123456' });

      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'user@test.com', password: 'wrongpassword' })
         .expect(401);

      expect(res.body.message).toBe('Invalid Password!');
   });

   it('should fail login for non-existent user', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'user@test.com', password: 'wrongpassword' })
         .expect(404);

      expect(res.body.message).toBe('User not Registered!');
   });
});



describe('AuthModule - Change Password', () => {
   let token: string;
   let userId: string;
   const oldPassword = 'OldPass123!';
   const newPassword = 'NewPass123!';

   beforeEach(async () => {
      const user = await registerTestUser(app, { email: 'change@test.com', password: oldPassword });
      userId = user._id;

      const loginRes = await request(app.getHttpServer())
         .post('/auth/login')
         .send({ email: 'change@test.com', password: oldPassword })
         .expect(201);

      token = loginRes.body.token;
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

      // Verify password updated in DB
      //  const updatedUser = await userService.findByIDWithPassword(userId);
      //  const match = await bcrypt.compare(newPassword, updatedUser.password);
      //  expect(match).toBe(true);
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
         .set('Authorization',`Bearer ${token}`)
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