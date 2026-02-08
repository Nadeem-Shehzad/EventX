export const REDIS_TIMEOUTS = {
   defaultCommandTimeout: 5000,       // global Redis socketTimeoutMS
   aggregationSocketTimeoutMS: 60000,   // used only for heavy aggregation queries
};