"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoPerformanceHelper = void 0;
class MongoPerformanceHelper {
    static async checkAggregationPerformance(model, pipeline) {
        const explainResult = await model.aggregate(pipeline).explain('executionStats');
        let stats = {};
        if (explainResult.stages?.[0]?.$cursor?.executionStats) {
            stats = explainResult.stages[0].$cursor.executionStats;
        }
        else if (explainResult.executionStats) {
            stats = explainResult.executionStats;
        }
        else {
            throw new Error('Cannot find executionStats in explain output');
        }
        return {
            nReturned: stats.nReturned ?? 0,
            totalKeysExamined: stats.totalKeysExamined ?? 0,
            totalDocsExamined: stats.totalDocsExamined ?? 0,
            executionTimeMillis: stats.executionTimeMillis ?? 0,
        };
    }
}
exports.MongoPerformanceHelper = MongoPerformanceHelper;
//# sourceMappingURL=db-performance-checker.js.map