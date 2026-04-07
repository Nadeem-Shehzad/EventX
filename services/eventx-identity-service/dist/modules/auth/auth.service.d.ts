import { RegisterDTO } from "./dto/request/register.dto";
import { UserService } from "../user/user.service";
import { UserResponseDTO } from "../user/dto/user-response.dto";
import { LoginDTO } from "./dto/request/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ChangePasswordDTO } from "./dto/request/change-password.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { RedisService } from "src/redis/redis.service";
import { ResetPasswordDTO } from "./dto/request/reset-password.dto";
import { AuthHelper } from "./helpers/auth.helper";
import { LoggerService } from "../../common/logger/logger.service";
import { MetricsService } from "../../metrics/metrics.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly mailService;
    private readonly redis;
    private readonly helper;
    private readonly pinoLogger;
    private readonly metricsService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, mailService: MailerService, redis: RedisService, helper: AuthHelper, pinoLogger: LoggerService, metricsService: MetricsService);
    private readonly logger;
    register(data: RegisterDTO): Promise<UserResponseDTO>;
    login(loginData: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(id: string, cpData: ChangePasswordDTO): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        loggedOut: boolean;
    }>;
    refreshToken(userData: any, rf_Token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    sendVerificationEmail(id: string, email: string): Promise<void>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDTO): Promise<{
        message: string;
    }>;
}
