type Store = {
    requestId: string;
};
export declare class RequestContextService {
    private readonly als;
    run(store: Store, callback: () => void): void;
    getRequestId(): string | null;
}
export {};
