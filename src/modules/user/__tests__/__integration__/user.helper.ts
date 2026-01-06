import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { RegisterDTO } from "src/modules/auth/dto/register.dto";

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
      .field('name', userData.name)
      .field('email', userData.email)
      .field('password', userData.password)
      .field('role', userData.role)
      .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
      .expect(201);

   return { ...userData, _id: res.body.data._id }; // res.body.data._id // return data so the test can use it (e.g., for login)
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
      .post('/v1/auth/login')
      .send(userData)
      .expect(201);

   return res;
};