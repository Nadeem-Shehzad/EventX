"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginTestUser = exports.registerTestUser = void 0;
const supertest_1 = __importDefault(require("supertest"));
const registerTestUser = async (app, overrideData) => {
    const defaultData = {
        name: 'Test User',
        email: 'user@test.com',
        password: 'Aa$123456',
        role: 'user'
    };
    const userData = { ...defaultData, ...overrideData };
    const res = await (0, supertest_1.default)(app.getHttpServer())
        .post('/v1/auth/register')
        .field('name', userData.name)
        .field('email', userData.email)
        .field('password', userData.password)
        .field('role', userData.role)
        .attach('image', Buffer.from('fake-image-data'), 'test-image.jpg')
        .expect(201);
    return { ...userData, _id: res.body.data._id };
};
exports.registerTestUser = registerTestUser;
const loginTestUser = async (app, overrideData) => {
    const defaultData = {
        email: 'user@test.com',
        password: '123456',
    };
    const userData = { ...defaultData, ...overrideData };
    const res = await (0, supertest_1.default)(app.getHttpServer())
        .post('/v1/auth/login')
        .send(userData)
        .expect(201);
    return res;
};
exports.loginTestUser = loginTestUser;
//# sourceMappingURL=user.helper.js.map