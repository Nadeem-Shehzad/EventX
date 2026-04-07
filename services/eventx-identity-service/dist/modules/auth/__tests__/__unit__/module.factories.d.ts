import { AuthController } from "../../auth.controller";
import { AuthService } from "../../auth.service";
export declare function createAuthTestingModule(authServiceMock: any): Promise<{
    controller: AuthController;
    authService: AuthService;
}>;
