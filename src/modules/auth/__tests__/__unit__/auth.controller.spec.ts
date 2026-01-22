
import { UserResponseDTO } from "src/modules/user/dto/user-response.dto";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { createAuthTestingModule } from "./module.factories";
import { AuthController } from "../../auth.controller";
import { AuthService } from "../../auth.service";
import { RegisterDTO } from "../../dto/request/register.dto";
import { LoginDTO } from "../../dto/request/login.dto";
import { ChangePasswordDTO } from "../../dto/request/change-password.dto";
import { ForgotPasswordDTO } from "../../dto/request/forgot-password.dto";
import { ResetPasswordDTO } from "../../dto/request/reset-password.dto";


export class MockGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      return true;
   }
}

describe('AuthController - Register', () => {
   let controller: AuthController;
   let service: AuthService;

   // Mock response for register
   const mockUserResponse: UserResponseDTO = {
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
      const module = await createAuthTestingModule({
         register: jest.fn().mockResolvedValue(mockUserResponse),
      });

      controller = module.controller;
      service = module.authService;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call authService.register and return DTO response', async () => {
      const dto: RegisterDTO = {
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
      } as Express.Multer.File;

      const result = await controller.register(dto, mockFile);

      expect(service.register).toHaveBeenCalledWith({
         ...dto,
         image: {
            url: mockFile.path,
            publicId: mockFile.filename,
         },
      });

      expect(result).toEqual(mockUserResponse);
   })

});


describe('AuthController - Login', () => {
   let controller: AuthController;
   let service: AuthService;

   const loginResponse = {
      token: 'sjksdjskdjskdjskdj',
      refreshToken: 'kdfjdkjfdkjfdkfjk'
   }

   beforeEach(async () => {
      const module = await createAuthTestingModule({
         login: jest.fn().mockResolvedValue(loginResponse),
      });

      controller = module.controller;
      service = module.authService;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call authService.register and return DTO response', async () => {
      const dto: LoginDTO = {
         email: 'test@mail.com',
         password: '123456'
      };

      const result = await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(loginResponse);
   });

})


describe('AuthController - Change-Password', () => {
   let controller: AuthController;
   let service: AuthService;

   const outputResponse = 'password changed successfully.';

   beforeEach(async () => {
      const module = await createAuthTestingModule({
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
      const dto: ChangePasswordDTO = {
         currentPassword: '123456',
         newPassword: '112233',
         confirmPassword: '112233'
      };

      const result = await controller.changePassword(userId, dto);
      expect(service.changePassword).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(outputResponse);
   });

})


describe('AuthController - Refresh-Token', () => {
   let controller: AuthController;
   let service: AuthService;

   const outputResponse = {
      access_token: 'sjksdjskdjskdjskdj',
      refresh_token: 'kdfjdkjfdkjfdkfjk'
   }

   beforeEach(async () => {
      const module = await createAuthTestingModule({
         refreshToken: jest.fn().mockResolvedValue(outputResponse),
      });

      controller = module.controller;
      service = module.authService;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call authService.refreshToken and return response', async () => {
      const req: any = {
         user: {
            id: 'j1jh21',
            name: 'nadeem',
            email: 'nadeem@gmail.com',
            role: 'user'
         },
         rf_Token: 'hjshdjshdjsdhj'
      };

      const result = await controller.refreshToken(req);
      expect(service.refreshToken).toHaveBeenCalledWith(
         req.user,
         req.rf_Token
      );
      expect(result).toEqual(outputResponse);
   });

})


describe('AuthController - verify-email', () => {
   let controller: AuthController;
   let service: AuthService;

   const outputResponse = {
      message: 'Email verified successfully.'
   }

   beforeEach(async () => {
      const module = await createAuthTestingModule({
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

})


describe('AuthController - forgot-password', () => {
   let controller: AuthController;
   let service: AuthService;

   const outputResponse = undefined;

   beforeEach(async () => {
      const module = await createAuthTestingModule({
         forgotPassword: jest.fn().mockResolvedValue(outputResponse),
      });

      controller = module.controller;
      service = module.authService;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call authService.forgotPassword and return response', async () => {
      const dto: ForgotPasswordDTO = {
         email: 'nadeem@gmail.com'
      };

      const result = await controller.forgotPassword(dto);
      expect(service.forgotPassword).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(outputResponse);
   });

})


describe('AuthController - reset-password', () => {
   let controller: AuthController;
   let service: AuthService;

   const outputResponse = {
      message: 'Email verified successfully.'
   }

   beforeEach(async () => {
      const module = await createAuthTestingModule({
         resetPassword: jest.fn().mockResolvedValue(outputResponse),
      });

      controller = module.controller;
      service = module.authService;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call authService.resetPassword and return response', async () => {
      const dto: ResetPasswordDTO = {
         token: 'sjhsjhdjshdjshd',
         newPassword: '111222',
         confirmPassword: '111222'
      };

      const result = await controller.resetPassword(dto);

      expect(service.resetPassword).toHaveBeenCalledTimes(1);
      expect(service.resetPassword).toHaveBeenCalledWith(dto);

      expect(result).toEqual(outputResponse);
   });

})