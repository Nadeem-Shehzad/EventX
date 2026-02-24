import { Model } from 'mongoose';

interface AggregationPerfStats {
  nReturned: number;
  totalKeysExamined: number;
  totalDocsExamined: number;
  executionTimeMillis: number;
}

export class MongoPerformanceHelper {
  /**
   * Check performance of any aggregation pipeline on any model
   * @param model Mongoose Model
   * @param pipeline Aggregation pipeline
   * @returns Aggregation performance stats
   */
  static async checkAggregationPerformance(
    model: Model<any>,
    pipeline: any[]
  ): Promise<AggregationPerfStats> {
    const explainResult = await model.aggregate(pipeline).explain('executionStats');

    // Traverse dynamically to get executionStats
    // MongoDB returns executionStats inside stages[0].$cursor.executionStats or directly for simple aggregations
    let stats: any = {};

    if (explainResult.stages?.[0]?.$cursor?.executionStats) {
      stats = explainResult.stages[0].$cursor.executionStats;
    } else if (explainResult.executionStats) {
      stats = explainResult.executionStats;
    } else {
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
