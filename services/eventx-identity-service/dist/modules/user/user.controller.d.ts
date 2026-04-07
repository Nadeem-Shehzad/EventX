import { UserService } from "./user.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserResponseDTO } from "./dto/user-response.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    profile(id: string): Promise<UserResponseDTO>;
    updateProfile(id: string, dataToUpdate: UpdateUserDTO, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
    deleteAccount(id: string): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<UserResponseDTO[]>;
    getUserByID(id: string): Promise<UserResponseDTO>;
    updateUserProfile(id: string, dataToUpdate: UpdateUserDTO): Promise<{
        message: string;
    }>;
    deleteUserAccount(id: string): Promise<{
        message: string;
    }>;
    getUserInternal(id: string, apiKey: string): Promise<UserResponseDTO>;
}
