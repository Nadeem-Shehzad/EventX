import { Model } from 'mongoose';
interface AggregationPerfStats {
    nReturned: number;
    totalKeysExamined: number;
    totalDocsExamined: number;
    executionTimeMillis: number;
}
export declare class MongoPerformanceHelper {
    static checkAggregationPerformance(model: Model<any>, pipeline: any[]): Promise<AggregationPerfStats>;
}
export {};
