import { Counter, Gauge, Histogram } from 'prom-client';
export declare class MetricsService {
    private readonly loginTotal;
    private readonly loginSuccess;
    private readonly loginFailed;
    private readonly activeUsers;
    private readonly logoutUsers;
    private readonly registerTotal;
    private readonly registerSuccess;
    private readonly registerFailed;
    private readonly loginDuration;
    private activeUserIds;
    constructor(loginTotal: Counter<string>, loginSuccess: Counter<string>, loginFailed: Counter<string>, activeUsers: Gauge<string>, logoutUsers: Counter<string>, registerTotal: Counter<string>, registerSuccess: Counter<string>, registerFailed: Counter<string>, loginDuration: Histogram<string>);
    incrementLoginAttempt(): void;
    incrementLoginSuccess(userId: string): void;
    incrementLoginFailed(reason: 'invalid_credentials' | 'user_not_found' | 'unknown'): void;
    decrementActiveUsers(userId: string): void;
    incrementRegisterAttempts(): void;
    incrementRegisterSuccess(): void;
    incrementRegisterFailed(reason: 'invalid_credentials' | 'db_down' | 'unknown'): void;
    incrementLoginDuration(status: string, durationMs: number): Promise<void>;
}
