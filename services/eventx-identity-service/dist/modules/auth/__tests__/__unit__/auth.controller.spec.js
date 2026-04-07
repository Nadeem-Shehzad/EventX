"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGuard = void 0;
const module_factories_1 = require("./module.factories");
class MockGuard {
    canActivate(context) {
        return true;
    }
}
exports.MockGuard = MockGuard;
describe('AuthController - Register', () => {
    let controller;
    let service;
    const mockUserResponse = {
        _id: 'abc123',
        name: 'John Doe',
        email: 'test@mail.com',
        image: {
            url: 'https://cloudinary.com/test-image.jpg',
            publicId: 'eventx/events/test-id'
        },
        role: 'user',
        isVerified: false
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            register: jest.fn().mockResolvedValue(mockUserResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.register and return DTO response', async () => {
        const dto = {
            name: 'John Doe',
            email: 'test@mail.com',
            password: '123456',
            image: {
                url: 'https://cloudinary.com/test-image.jpg',
                publicId: 'eventx/events/test-id'
            },
            role: 'user'
        };
        const mockFile = {
            path: 'https://cloudinary.com/test-image.jpg',
            filename: 'eventx/events/test-id',
        };
        const result = await controller.register(dto, mockFile);
        expect(service.register).toHaveBeenCalledWith({
            ...dto,
            image: {
                url: mockFile.path,
                publicId: mockFile.filename,
            },
        });
        expect(result).toEqual(mockUserResponse);
    });
});
describe('AuthController - Login', () => {
    let controller;
    let service;
    const loginResponse = {
        token: 'sjksdjskdjskdjskdj',
        refreshToken: 'kdfjdkjfdkjfdkfjk'
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            login: jest.fn().mockResolvedValue(loginResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.register and return DTO response', async () => {
        const dto = {
            email: 'test@mail.com',
            password: '123456'
        };
        const result = await controller.login(dto);
        expect(service.login).toHaveBeenCalledWith(dto);
        expect(result).toEqual(loginResponse);
    });
});
describe('AuthController - Change-Password', () => {
    let controller;
    let service;
    const outputResponse = 'password changed successfully.';
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            changePassword: jest.fn().mockResolvedValue(outputResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.changePassword and return response', async () => {
        const userId = '1a2b3c4d';
        const dto = {
            currentPassword: '123456',
            newPassword: '112233',
            confirmPassword: '112233'
        };
        const result = await controller.changePassword(userId, dto);
        expect(service.changePassword).toHaveBeenCalledWith(userId, dto);
        expect(result).toEqual(outputResponse);
    });
});
describe('AuthController - Refresh-Token', () => {
    let controller;
    let service;
    const outputResponse = {
        access_token: 'sjksdjskdjskdjskdj',
        refresh_token: 'kdfjdkjfdkjfdkfjk'
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            refreshToken: jest.fn().mockResolvedValue(outputResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.refreshToken and return response', async () => {
        const req = {
            user: {
                id: 'j1jh21',
                name: 'nadeem',
                email: 'nadeem@gmail.com',
                role: 'user'
            },
            rf_Token: 'hjshdjshdjsdhj'
        };
        const result = await controller.refreshToken(req);
        expect(service.refreshToken).toHaveBeenCalledWith(req.user, req.rf_Token);
        expect(result).toEqual(outputResponse);
    });
});
describe('AuthController - verify-email', () => {
    let controller;
    let service;
    const outputResponse = {
        message: 'Email verified successfully.'
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            verifyEmail: jest.fn().mockResolvedValue(outputResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.verifyEmail and return response', async () => {
        const token = 'sjhsjdhsjhjshsjd';
        const result = await controller.verifyEmail(token);
        expect(service.verifyEmail).toHaveBeenCalledWith(token);
        expect(result).toEqual(outputResponse);
    });
});
describe('AuthController - forgot-password', () => {
    let controller;
    let service;
    const outputResponse = undefined;
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            forgotPassword: jest.fn().mockResolvedValue(outputResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.forgotPassword and return response', async () => {
        const dto = {
            email: 'nadeem@gmail.com'
        };
        const result = await controller.forgotPassword(dto);
        expect(service.forgotPassword).toHaveBeenCalledWith(dto.email);
        expect(result).toEqual(outputResponse);
    });
});
describe('AuthController - reset-password', () => {
    let controller;
    let service;
    const outputResponse = {
        message: 'Email verified successfully.'
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createAuthTestingModule)({
            resetPassword: jest.fn().mockResolvedValue(outputResponse),
        });
        controller = module.controller;
        service = module.authService;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call authService.resetPassword and return response', async () => {
        const dto = {
            token: 'sjhsjhdjshdjshd',
            newPassword: '111222',
            confirmPassword: '111222'
        };
        const result = await controller.resetPassword(dto);
        expect(service.resetPassword).toHaveBeenCalledTimes(1);
        expect(service.resetPassword).toHaveBeenCalledWith(dto);
        expect(result).toEqual(outputResponse);
    });
});
//# sourceMappingURL=auth.controller.spec.js.map