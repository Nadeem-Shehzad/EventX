import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/request/register.dto";
import { LoginDTO } from "./dto/request/login.dto";
import type { Request } from "express";
import { ChangePasswordDTO } from "./dto/request/change-password.dto";
import { ForgotPasswordDTO } from "./dto/request/forgot-password.dto";
import { ResetPasswordDTO } from "./dto/request/reset-password.dto";
import { UserResponseDTO } from "../user/dto/user-response.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(data: RegisterDTO, file?: Express.Multer.File): Promise<UserResponseDTO>;
    login(loginData: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(id: string, cpData: ChangePasswordDTO): Promise<{
        message: string;
    }>;
    logout(id: string): Promise<{
        loggedOut: boolean;
    }>;
    refreshToken(req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    sendVerificationEmail(id: string, email: string): Promise<void>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(body: ForgotPasswordDTO): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDTO): Promise<{
        message: string;
    }>;
}
