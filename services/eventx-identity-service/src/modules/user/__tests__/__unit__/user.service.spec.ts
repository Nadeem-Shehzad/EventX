import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../user.service";
import { UserRepository } from "../../user.repository";
import { UserResponseDTO } from "../../dto/user-response.dto";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDTO } from "../../dto/update-user.dto";
import { v2 as cloudinary } from 'cloudinary';


jest.mock('cloudinary', () => ({
   v2: {
      uploader: {
         destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
      },
   },
}));


describe('UserService - Profile', () => {
   let service: UserService;

   const userRepository = {
      findUserById: jest.fn()
   }

   const id = '6946bb33d16c4c03c0f00000';
   const mockUserResponse: UserResponseDTO = {
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      image: {
         url: 'abc',
         publicId: 'abc/cbs'
      },
      role: 'user',
      isVerified: false
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository }
         ]
      }).compile();

      service = module.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should give NotFoundException - if user not found', async () => {
      userRepository.findUserById.mockResolvedValueOnce(null);
      await expect(service.getUserProfile(id)).rejects.toThrow(NotFoundException);
   });

   it('should give user profile', async () => {
      userRepository.findUserById.mockResolvedValueOnce(mockUserResponse);

      const result = await service.getUserProfile(id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUserResponse);
   });
});


describe('UserService - Update Profile', () => {
   let service: UserService;

   const userRepository = {
      findUserById: jest.fn(),
      update: jest.fn()
   }

   const id = '6946bb33d16c4c03c0f00000';
   const dataToUpdate: UpdateUserDTO = {
      name: 'John Doe'
   };

   const mockUser = {
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   };

   const mockResult = { message: 'Profile updated successfully' };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository }
         ]
      }).compile();

      jest.clearAllMocks();
      service = module.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should update user profile', async () => {
      // Ensure findUserById returns the user so it passes the first check
      userRepository.findUserById.mockResolvedValueOnce(mockUser);

      // Ensure update returns the updated user so it passes the if(!result) check
      userRepository.update.mockResolvedValueOnce(mockUser);

      const result = await service.updateProfile(id, dataToUpdate);

      expect(userRepository.findUserById).toHaveBeenCalledWith(id);
      expect(userRepository.update).toHaveBeenCalledWith(id, dataToUpdate);
      expect(result).toEqual(mockResult);
   });

   it('should delete old image from cloudinary if new image is provided', async () => {
      const userWithImage = { ...mockUser, image: { publicId: 'old_id', url: '...' } };
      const dataWithNewImage = { ...dataToUpdate, image: { publicId: 'new_id', url: '...' } };

      userRepository.findUserById.mockResolvedValueOnce(userWithImage);
      userRepository.update.mockResolvedValueOnce(userWithImage);

      const cloudinary = require('cloudinary').v2;

      await service.updateProfile(id, dataWithNewImage);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('old_id');
      expect(userRepository.update).toHaveBeenCalled();
   });

   it('should give NotFoundException - if user not found', async () => {
      userRepository.findUserById.mockResolvedValueOnce(null)
      userRepository.update.mockResolvedValueOnce(null);
      await expect(service.updateProfile(id, dataToUpdate)).rejects.toThrow(NotFoundException);
   });
});


describe('UserService - Delete Account', () => {
   let service: UserService;

   const userRepository = {
      findUserById: jest.fn(),
      removeAccount: jest.fn()
   }

   const id = '6946bb33d16c4c03c0f00000';
   const mockResult = { message: 'Account deleted successfully' };
   const mockUserDocument = {
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository }
         ]
      }).compile();

      service = module.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should delete user account', async () => {
      userRepository.findUserById.mockResolvedValueOnce(mockUserDocument);
      userRepository.removeAccount.mockResolvedValueOnce(mockUserDocument);

      const result = await service.deleteAccount(id);

      expect(userRepository.removeAccount).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResult);
   });

   it('should give NotFoundException - if user not found', async () => {
      userRepository.findUserById.mockResolvedValueOnce(null)
      userRepository.removeAccount.mockResolvedValueOnce(null);
      await expect(service.deleteAccount(id)).rejects.toThrow(NotFoundException);
   });
});


describe('UserService - Get All Users', () => {
   let service: UserService;

   const userRepository = { findAllUsers: jest.fn() }

   const mockUserResponse = [{
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   }];

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository }
         ]
      }).compile();

      service = module.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should Give All Users Data', async () => {
      userRepository.findAllUsers.mockResolvedValueOnce(mockUserResponse);

      const result = await service.getAllUsers();

      expect(userRepository.findAllUsers).toHaveBeenCalledWith();
      expect(result).toEqual(mockUserResponse);
   });
});


describe('UserService - Get Single User', () => {
   let service: UserService;

   const userRepository = { findUserById: jest.fn() }

   const id = '6946bb33d16c4c03c0f00000';
   const mockUserResponse = {
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      role: 'user',
      isVerified: false
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserService,
            { provide: UserRepository, useValue: userRepository }
         ]
      }).compile();

      service = module.get<UserService>(UserService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should give NotFoundException - if user not found', async () => {
      userRepository.findUserById.mockResolvedValueOnce(null);
      await expect(service.getUserDataByID(id)).rejects.toThrow(NotFoundException);
   });

   it('should Give All Users Data', async () => {
      userRepository.findUserById.mockResolvedValueOnce(mockUserResponse);

      const result = await service.getUserDataByID(id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUserResponse);
   });
});