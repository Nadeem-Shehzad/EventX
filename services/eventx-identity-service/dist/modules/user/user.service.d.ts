import { User, UserDocument } from "./user.schema";
import { UserRepository } from "./user.repository";
import { UserResponseDTO } from "./dto/user-response.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { LoggerService } from "../../common/logger/logger.service";
export declare class UserService {
    private readonly userRepo;
    private readonly pinoLogger;
    constructor(userRepo: UserRepository, pinoLogger: LoggerService);
    private readonly logger;
    getUserProfile(id: string): Promise<UserResponseDTO>;
    getUserDataByID(id: string): Promise<UserResponseDTO>;
    deleteAccount(id: string): Promise<{
        message: string;
    }>;
    updateProfile(id: string, dataToUpdate: UpdateUserDTO): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<UserResponseDTO[]>;
    createUser(data: Partial<User>): Promise<UserDocument | null>;
    getUserById(id: string): Promise<UserDocument | null>;
    findUserByIDWithPassword(id: string): Promise<UserDocument | null>;
    getUserByEmail(email: string): Promise<UserDocument | null>;
    getUserByEmailWithPassword(email: string): Promise<UserDocument | null>;
    getUserByIdWithRefreshToken(id: string): Promise<UserDocument | null>;
    updateUser(id: any, dataToUpdate: any): Promise<UserDocument | null>;
    removeUserToken(id: any): Promise<UserDocument | null>;
}
