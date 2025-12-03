import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserService } from "../../user/user.service";
import {
   BadRequestException,
   ConflictException,
   NotFoundException,
   UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from "../dto/register.dto";
import { UserResponseDTO } from "../../user/dto/user-response.dto";
import { plainToInstance } from "class-transformer";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { RedisService } from "../../../redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from "../dto/login.dto";
import { ChangePasswordDTO } from "../dto/change-password.dto";


// 1. MOCK BCRYPT GLOBALLY
// This prevents the "Cannot redefine property" error
jest.mock('bcrypt');

describe('AuthService - register', () => {

   let service: AuthService;

   // Define the mock object structure
   const userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
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

   beforeEach(async () => {
      // 2. RESET MOCKS BEFORE EVERY TEST
      // This fixes the "Resolved instead of rejected" error by clearing previous test data
      jest.resetAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: UserService, useValue: userService },
            { provide: ConfigService, useValue: {} },
            { provide: MailerService, useValue: { sendMail: jest.fn() } },
            { provide: RedisService, useValue: { get: jest.fn(), set: jest.fn() } },
            { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
         ],
      }).compile();

      service = module.get<AuthService>(AuthService);
   });

   it('should register a new user successfully', async () => {
      const dto: RegisterDTO = {
         name: 'John Doe',
         email: 'test@mail.com',
         password: '123456',
      };

      // 1️⃣ Email not exists (Return null)
      userService.findByEmail.mockResolvedValueOnce(null);

      // 2️⃣ Mock bcrypt hash
      // Since we mocked the library globally, we just cast it to jest.Mock
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      // 3️⃣ Mock userService.create resolves
      userService.create.mockResolvedValueOnce(undefined);

      // 4️⃣ Mock findByEmail after creation returns user
      userService.findByEmail.mockResolvedValueOnce(mockUser);

      const result = await service.register(dto);

      // ✅ Verify method calls
      expect(userService.findByEmail).toHaveBeenNthCalledWith(1, dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(userService.create).toHaveBeenCalledWith({
         ...dto,
         password: 'hashedpassword',
      });

      // ✅ Verify returned DTO
      expect(result).toEqual(
         plainToInstance(UserResponseDTO, mockUser, { excludeExtraneousValues: true }),
      );
   });

   it('should throw ConflictException if email already exists', async () => {
      const dto: RegisterDTO = {
         name: 'John Doe',
         email: 'test@mail.com',
         password: '123456',
      };

      // 1️⃣ Email ALREADY exists (Return user immediately)
      // Because we used resetAllMocks(), this is guaranteed to be the first call
      userService.findByEmail.mockResolvedValueOnce(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);

      // Ensure create was NOT called
      expect(userService.create).not.toHaveBeenCalled();
   });
});


describe('AuthService - Login', () => {
   let service: AuthService;

   const userService = {
      findByEmailWithPassword: jest.fn(),
      update: jest.fn()
   }

   const jwtService = { sign: jest.fn() };
   const configService = { get: jest.fn() };

   const dto: LoginDTO = {
      email: 'nadeem@gmail.com',
      password: '111222'
   }

   beforeEach(async () => {

      jest.resetAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: UserService, useValue: userService },
            { provide: ConfigService, useValue: configService },
            { provide: JwtService, useValue: jwtService },
            { provide: RedisService, useValue: {} },
            { provide: MailerService, useValue: {} }
         ],
      }).compile();

      service = module.get<AuthService>(AuthService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('it should throw NotFoundException if email not exists', async () => {
      userService.findByEmailWithPassword.mockResolvedValueOnce(null);
      await expect(service.login(dto)).rejects.toThrow(NotFoundException)
   });

   it('it should throw UnAuthorizedException if password not matched', async () => {
      const fakeUser = { _id: 'u1', name: 'John', email: dto.email, role: 'user', password: 'hashed' };

      userService.findByEmailWithPassword.mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
   });

   it('should return token and refreshToken on successful login', async () => {
      const fakeUser = { _id: 'u1', name: 'John', email: dto.email, role: 'user', password: 'hashed' };
      const token = 'fake.jwt.token';
      const refreshToken = 'fake.refresh.token';

      // Mock methods
      userService.findByEmailWithPassword.mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      jwtService.sign
         .mockReturnValueOnce(token)            // Access token
         .mockReturnValueOnce(refreshToken);   // Refresh token

      configService.get.mockImplementation((key) => {
         if (key === 'JWT_REFRESH_SECRET') return 'refresh_secret';
         if (key === 'JWT_REFRESH_EXPIRES') return '7d';
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_refresh_token');

      const result = await service.login(dto);

      expect(userService.findByEmailWithPassword).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, fakeUser.password);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(userService.update).toHaveBeenCalledWith(fakeUser._id, { refreshToken: 'hashed_refresh_token' });
      expect(result).toEqual({ token, refreshToken });
   });
});


describe('AuthService - ChangePassword', () => {
   let service: AuthService;

   const userService = {
      findByIDWithPassword: jest.fn(),
      update: jest.fn()
   }

   const userId = '1a2v3d';
   const dto: ChangePasswordDTO = {
      currentPassword: '123456',
      newPassword: '111222',
      confirmPassword: '111222'
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: UserService, useValue: userService },
            { provide: ConfigService, useValue: {} },
            { provide: JwtService, useValue: {} },
            { provide: RedisService, useValue: {} },
            { provide: MailerService, useValue: {} }
         ]
      }).compile();
      service = module.get<AuthService>(AuthService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should throw NotFoundException - if user not found', async () => {
      userService.findByIDWithPassword.mockResolvedValueOnce(null);
      await expect(service.changePassword(userId, dto)).rejects.toThrow(NotFoundException);
   });

   it('should throw UnAuthorizedException - if password not matched', async () => {
      const fakeUser = { _id: userId, name: 'John', email: 'nadeem@gmail.com', role: 'user', password: dto.currentPassword };
      userService.findByIDWithPassword.mockResolvedValueOnce(fakeUser);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.changePassword(userId, dto)).rejects.toThrow(UnauthorizedException);
   });

   it('should throw ConflictException - if old password and new password are same', async () => {
      const fakeUser = { _id: userId, name: 'John', email: 'nadeem@gmail.com', role: 'user', password: dto.currentPassword };
      userService.findByIDWithPassword.mockResolvedValueOnce(fakeUser);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const dto2: ChangePasswordDTO = {
         currentPassword: '123456',
         newPassword: '123456',
         confirmPassword: '123456'
      }

      await expect(service.changePassword(userId, dto2)).rejects.toThrow(ConflictException);
   });

   it('should throw BadRequestException - if new password and confirm password are not same', async () => {
      const fakeUser = { _id: userId, name: 'John', email: 'nadeem@gmail.com', role: 'user', password: dto.currentPassword };
      userService.findByIDWithPassword.mockResolvedValueOnce(fakeUser);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const dto2: ChangePasswordDTO = {
         currentPassword: '123456',
         newPassword: '111222',
         confirmPassword: '112233'
      }

      await expect(service.changePassword(userId, dto2)).rejects.toThrow(BadRequestException);
   });

   it('should change password', async () => {
      const fakeUser = { _id: userId, name: 'John', email: 'nadeem@gmail.com', role: 'user', password: dto.currentPassword };
      const newHashedPassword = 'skjskjdskdjksdj';

      userService.findByIDWithPassword.mockResolvedValueOnce(fakeUser);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(newHashedPassword);

      const result = await service.changePassword(userId, dto);
      expect(userService.findByIDWithPassword).toHaveBeenCalledWith(fakeUser._id);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.currentPassword, fakeUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.newPassword, 10);
      expect(userService.update).toHaveBeenCalledWith(userId, { password: newHashedPassword });
      expect(result).toEqual('Password Changed Successfully.');
   });
});


describe('AuthService - RefreshToken', () => {
   let service: AuthService;

   const userService = {
      findByIdWithRefreshToken: jest.fn(),
      update: jest.fn()
   }

   const jwtService = {
      sign: jest.fn()
   }

   const configService = {
      get: jest.fn()
   }

   const rfToken = 'asjhaskjhaksdjh';
   const fakeUser = {
      id: '1h2jh3j',
      name: 'nadeem',
      email: 'nadeem@gmail.com',
      role: 'user'
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: UserService, useValue: userService },
            { provide: ConfigService, useValue: configService },
            { provide: JwtService, useValue: jwtService },
            { provide: RedisService, useValue: {} },
            { provide: MailerService, useValue: {} }
         ]
      }).compile();
      service = module.get<AuthService>(AuthService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should throw NotFoundException - if user not found', async () => {
      userService.findByIdWithRefreshToken.mockResolvedValueOnce(null);
      await expect(service.refreshToken(fakeUser, rfToken)).rejects.toThrow(NotFoundException);
   });

   it('should throw UnauthorizedException - if refresh token not valid', async () => {
      userService.findByIdWithRefreshToken.mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.refreshToken(fakeUser, rfToken)).rejects.toThrow(UnauthorizedException);
   });

   it('should return Refresh Token', async () => {
      userService.findByIdWithRefreshToken.mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const access_token = 'fake.access.token';
      const refresh_token = 'fake.refresh.token';
      jwtService.sign
         .mockReturnValueOnce(access_token)
         .mockReturnValueOnce(refresh_token);

      configService.get.mockImplementation((key) => {
         if (key === 'JWT_REFRESH_SECRET') return 'refresh_secret';
         if (key === 'JWT_REFRESH_EXPIRES') return '7d';
      });

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(refresh_token);

      const result = await service.refreshToken(fakeUser, rfToken);

      expect(result).toEqual({ access_token, refresh_token });
   });
});


describe('AuthService - Verify Email', () => {
   let service: AuthService;

   const userService = {
      findUserById: jest.fn(),
      update: jest.fn()
   }

   const jwtService = {
      verifyAsync: jest.fn()
   }

   const token = 'asjhaskjhaksdjh';
   const fakeUser = {
      id: '1h2jh3j',
      name: 'nadeem',
      email: 'nadeem@gmail.com',
      role: 'user'
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: UserService, useValue: userService },
            { provide: ConfigService, useValue: {} },
            { provide: JwtService, useValue: jwtService },
            { provide: RedisService, useValue: {} },
            { provide: MailerService, useValue: {} }
         ]
      }).compile();
      service = module.get<AuthService>(AuthService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should throw NotFoundException - if user not found', async () => {
      jwtService.verifyAsync.mockResolvedValueOnce(fakeUser);
      userService.findUserById.mockResolvedValueOnce(null);
      await expect(service.verifyEmail(token)).rejects.toThrow(NotFoundException);
   });

   it('should return Email Already Verified', async () => {
      const fakeUser2 = {
         id: '1h2jh3j',
         name: 'nadeem',
         email: 'nadeem@gmail.com',
         role: 'user',
         isVerified: true
      }
      jwtService.verifyAsync.mockResolvedValueOnce(fakeUser);
      userService.findUserById.mockResolvedValueOnce(fakeUser2);

      const result = await service.verifyEmail(token);

      expect(result).toEqual({ message: 'Email Already Verified.' });
   });

   it('should return Email verified successfully.', async () => {
      const fakeUser2 = {
         _id: '1h2jh3j',
         name: 'nadeem',
         email: 'nadeem@gmail.com',
         role: 'user',
         isVerified: false
      }
      jwtService.verifyAsync.mockResolvedValueOnce(fakeUser);
      userService.findUserById.mockResolvedValueOnce(fakeUser2);

      const result = await service.verifyEmail(token);

      expect(userService.update).toHaveBeenCalledWith(fakeUser2._id, { isVerified: true });
      expect(result).toEqual({ message: 'Email verified successfully.' });
   });


});