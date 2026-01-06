// utils/auth.helper.ts
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterDTO } from '../../dto/register.dto';

export const registerTestUser = async (
   app: INestApplication,
   overrideData?: Partial<{ name: string; email: string; password: string, role: string }>
) => {
   const defaultData = {
      name: 'Test User',
      email: 'user@test.com',
      password: 'Aa$123456',
      role: 'user'
   };

   const userData = { ...defaultData, ...overrideData };

   const res = await request(app.getHttpServer())
      .post('/v1/auth/register')
      // 1. Use .field() for text data instead of .send()
      .field('name', userData.name)
      .field('email', userData.email)
      .field('password', userData.password)
      .field('role', userData.role)
      // 2. Use .attach() to satisfy the "Image is required" check
      // Parameters: (fieldName, fileBuffer, fileName)
      .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
      .expect(201);

      //console.log('Register - res --> ', res.body.data);

   return { ...userData, _id: res.body.data._id }; // return data so the test can use it (e.g., for login)
};


export const loginTestUser = async (
   app: INestApplication,
   overrideData?: Partial<{ email: string; password: string }>
) => {
   const defaultData = {
      email: 'user@test.com',
      password: '123456',
   };

   const userData = { ...defaultData, ...overrideData };

   const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userData)
      .expect(201);

   return res;
};


export const forgotPasswordTestUser = async (
   app: INestApplication,
   overrideData?: Partial<{ email: string }>
) => {
   const defaultData = {
      email: 'user@test.com'
   };

   const userData = { ...defaultData, ...overrideData };

   const res = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send(userData)
      .expect(201);

   return res;
};