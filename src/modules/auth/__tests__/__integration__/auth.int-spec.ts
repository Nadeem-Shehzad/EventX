import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth.module';

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

// 1. Declare variables at the top level scope
let app: INestApplication;
let mongoServer: MongoMemoryServer;
let connection: Connection;

// 2. Define Hooks globally for the file
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
   await app.init();

   connection = moduleRef.get(getConnectionToken());
});

afterAll(async () => {
   await connection.close();
   if (mongoServer) await mongoServer.stop();
   if (app) await app.close();
});

afterEach(async () => {
   const collections = connection.collections;
   for (const key in collections) {
      await collections[key].deleteMany({});
   }
});

// 3. Now you can have multiple root describe blocks sharing the same app instance
describe('AuthModule - Registration', () => {
   it('should register a user successfully', async () => {
      const res = await request(app.getHttpServer())
         .post('/auth/register')
         .send({ name: 'Test User', email: 'user@test.com', password: '123456' })
         .expect(201);

      const user = await connection.collection('users').findOne({ email: 'user@test.com' });

      expect(user).not.toBeNull();
      expect(user?.email).toBe('user@test.com');
   });
});

describe('AuthModule - Login', () => {
   // You can add login tests here, and they will use the same 'app' and 'connection'
   it('should be able to login with registered user', async () => {
      // Create user manually since DB is cleared afterEach
      // ... logic
   });
});