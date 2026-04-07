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
describe('UserController - Profile', () => {
    let controller;
    let service;
    const mockUserResponse = {
        _id: 'abc123',
        name: 'John Doe',
        email: 'test@mail.com',
        image: {
            url: '',
            publicId: ''
        },
        role: 'user',
        isVerified: false
    };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            getUserProfile: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.getUserProfile and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.profile(id);
        expect(service.getUserProfile).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Update Profile', () => {
    let controller;
    let service;
    const dataToUpdate = {
        name: 'John Doe',
    };
    const mockUserResponse = { message: 'Profile updated successfully' };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            updateProfile: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.updateProfile and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.updateProfile(id, dataToUpdate);
        expect(service.updateProfile).toHaveBeenCalledWith(id, dataToUpdate);
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Delete Account', () => {
    let controller;
    let service;
    const mockUserResponse = { message: 'Account deleted successfully' };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            deleteAccount: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.deleteAccount and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.deleteAccount(id);
        expect(service.deleteAccount).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Gel All Users', () => {
    let controller;
    let service;
    const mockUserResponse = [{
            _id: 'abc123',
            name: 'John Doe',
            email: 'test@mail.com',
            role: 'user',
            isVerified: false
        }];
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            getAllUsers: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.getAllUsers and return DTO response', async () => {
        const result = await controller.getAllUsers();
        expect(service.getAllUsers).toHaveBeenCalledWith();
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Get User By ID', () => {
    let controller;
    let service;
    const mockUserResponse = [{
            _id: 'abc123',
            name: 'John Doe',
            email: 'test@mail.com',
            role: 'user',
            isVerified: false
        }];
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            getUserDataByID: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.getuUserByID and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.getUserByID(id);
        expect(service.getUserDataByID).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Update Profile - Admin', () => {
    let controller;
    let service;
    const dataToUpdate = {
        name: 'John Doe',
    };
    const mockUserResponse = { message: 'Profile updated successfully' };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            updateProfile: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.updateProfile and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.updateUserProfile(id, dataToUpdate);
        expect(service.updateProfile).toHaveBeenCalledWith(id, dataToUpdate);
        expect(result).toEqual(mockUserResponse);
    });
});
describe('UserController - Delete Account - Admin', () => {
    let controller;
    let service;
    const mockUserResponse = { message: 'Account deleted successfully' };
    beforeEach(async () => {
        const module = await (0, module_factories_1.createUserTestingModule)({
            deleteAccount: jest.fn().mockResolvedValue(mockUserResponse)
        });
        controller = module.controller;
        service = module.service;
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should call userService.deleteAccount and return DTO response', async () => {
        const id = '6946bb33d16c4c03c0f00000';
        const result = await controller.deleteUserAccount(id);
        expect(service.deleteAccount).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserResponse);
    });
});
//# sourceMappingURL=user.controller.spec.js.map