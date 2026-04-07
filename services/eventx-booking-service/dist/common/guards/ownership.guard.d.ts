import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class AccountOwnerShipGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
