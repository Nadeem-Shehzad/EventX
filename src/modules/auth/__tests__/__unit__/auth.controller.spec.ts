
import { UserResponseDTO } from "src/modules/user/dto/user-response.dto";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { createAuthTestingModule } from "./module.factories";
import { AuthController } from "../../auth.controller";
import { AuthService } from "../../auth.service";
import { RegisterDTO } from "../../dto/register.dto";
import { LoginDTO } from "../../dto/login.dto";
import { ChangePasswordDTO } from "../../dto/change-password.dto";
import { ForgotPasswordDTO } from "../../dto/forgot-password.dto";
import { ResetPasswordDTO } from "../../dto/reset-password.dto";


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
         role: 'user'
      };

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
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