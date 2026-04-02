import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

type Store = {
   requestId: string;
};

@Injectable()
export class RequestContextService {
   private readonly als = new AsyncLocalStorage<Store>();

   run(store: Store, callback: () => void) {
      this.als.run(store, callback);
   }

   getRequestId(): string | null {
      return this.als.getStore()?.requestId || null;
   }
}