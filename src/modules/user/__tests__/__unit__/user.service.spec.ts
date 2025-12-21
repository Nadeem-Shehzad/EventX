import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../user.service";
import { UserRepository } from "../../user.repository";
import { UserResponseDTO } from "../../dto/user-response.dto";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDTO } from "../../dto/update-user.dto";


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
      password: 'hashedpassword',
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      toObject: function () { return this; },
   };

   const mockResult = { message: 'Profile updated successfully' };

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
      userRepository.update.mockResolvedValueOnce(null);
      await expect(service.updateProfile(id, dataToUpdate)).rejects.toThrow(NotFoundException);
   });

   it('should update user profile', async () => {
      userRepository.update.mockResolvedValueOnce(mockUser);

      const result = await service.updateProfile(id, dataToUpdate);

      expect(userRepository.update).toHaveBeenCalledWith(id, dataToUpdate);
      expect(result).toEqual(mockResult);
   });
});


describe('UserService - Delete Account', () => {
   let service: UserService;

   const userRepository = { removeAccount: jest.fn() }

   const id = '6946bb33d16c4c03c0f00000';
   const mockResult = { message: 'Account deleted successfully' };
   const mockUserDocument = {
      _id: 'abc123',
      name: 'John Doe',
      email: 'test@mail.com',
      password: '$2b$10$hashedPassword',
      role: 'user',
      isVerified: false,
      createdAt: new Date('2025-01-01T10:00:00Z'),
      updatedAt: new Date('2025-01-05T12:00:00Z'),
      __v: 0,
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
      userRepository.removeAccount.mockResolvedValueOnce(null);
      await expect(service.deleteAccount(id)).rejects.toThrow(NotFoundException);
   });

   it('should delete user account', async () => {
      userRepository.removeAccount.mockResolvedValueOnce(mockUserDocument);

      const result = await service.deleteAccount(id);

      expect(userRepository.removeAccount).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResult);
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