import {
   ConflictException, ServiceUnavailableException,
   RequestTimeoutException, InternalServerErrorException
} from '@nestjs/common';


export function throwDbException(err: any, context?: string): never {
   const ctx = context ? `[${context}] ` : '';

   if (err.code === 11000) {
      const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
      throw new ConflictException(`${ctx}${field} already exists`);
   }

   if (
      err.name === 'MongoServerSelectionError' ||
      err.name === 'MongoNetworkError'
   ) {
      throw new ServiceUnavailableException(`${ctx} - Database unavailable`);
   }

   if (
      err.name === 'MongooseError' &&
      err.message?.includes('timed out')
   ) {
      throw new RequestTimeoutException(`${ctx} - Database operation timed out`);
   }

   if (err.name === 'ValidationError') {
      throw new InternalServerErrorException(`${ctx} - Data validation failed`);
   }

   throw new InternalServerErrorException(`${ctx} - Unexpected database error`);
}