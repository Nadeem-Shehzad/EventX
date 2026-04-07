import { UserController } from "../../user.controller";
import { UserService } from "../../user.service";
export declare function createUserTestingModule(userMockService: any): Promise<{
    controller: UserController;
    service: UserService;
}>;
