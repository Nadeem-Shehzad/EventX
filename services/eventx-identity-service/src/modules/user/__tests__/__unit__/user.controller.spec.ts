import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UserController } from "../../user.controller";
import { UserService } from "../../user.service";
import { UserResponseDTO } from "../../dto/user-response.dto";
import { createUserTestingModule } from "./module.factories";
import { UpdateUserDTO } from "../../dto/update-user.dto";


export class MockGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      return true;
   }
}


describe('UserController - Profile', () => {
   let controller: UserController;
   let service: UserService;

   const mockUserResponse: UserResponseDTO = {
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
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const dataToUpdate: UpdateUserDTO = {
      name: 'John Doe',
   };

   const mockUserResponse = { message: 'Profile updated successfully' };

   beforeEach(async () => {
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const mockUserResponse = { message: 'Account deleted successfully' };

   beforeEach(async () => {
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const mockUserResponse = [{
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   }];

   beforeEach(async () => {
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const mockUserResponse = [{
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   }];

   beforeEach(async () => {
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const dataToUpdate: UpdateUserDTO = {
      name: 'John Doe',
   };

   const mockUserResponse = { message: 'Profile updated successfully' };

   beforeEach(async () => {
      const module = await createUserTestingModule({
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
   let controller: UserController;
   let service: UserService;

   const mockUserResponse = { message: 'Account deleted successfully' };

   beforeEach(async () => {
      const module = await createUserTestingModule({
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