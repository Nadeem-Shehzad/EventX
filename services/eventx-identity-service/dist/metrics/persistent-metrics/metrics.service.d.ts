import { OnModuleInit } from '@nestjs/common';
export declare class PersistentMetricsService implements OnModuleInit {
    private registry;
    private loginTotal;
    private loginSuccess;
    private loginFailed;
    private logoutTotal;
    private registerTotal;
    private gateway;
    onModuleInit(): Promise<void>;
    private push;
    incrementLoginTotal(): Promise<void>;
    incrementLoginSuccess(): Promise<void>;
    incrementLoginFailed(): Promise<void>;
    incrementLogout(): Promise<void>;
    incrementRegister(): Promise<void>;
}
