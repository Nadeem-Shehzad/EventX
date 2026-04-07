import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class MockGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
