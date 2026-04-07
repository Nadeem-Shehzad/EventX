import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { BaseRepository } from "src/common/base/base.pipeline";
import { MetricsService } from "../../metrics/metrics.service";
export declare class UserRepository extends BaseRepository<UserDocument> {
    private userModel;
    private readonly metricsService;
    constructor(userModel: Model<UserDocument>, metricsService: MetricsService);
    create(data: Partial<User>): Promise<UserDocument>;
    update(id: string, data: Partial<User>): Promise<UserDocument | null>;
    removeAccount(id: string): Promise<boolean>;
    removeToken(id: string): Promise<UserDocument | null>;
    findUserById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findAllUsers(): Promise<UserDocument[]>;
    findByEmailWithPassword(email: string): Promise<UserDocument | null>;
    findByIDWithPassword(id: string): Promise<UserDocument | null>;
    findByIdWithRefreshToken(id: string): Promise<UserDocument | null>;
}
