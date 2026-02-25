import { Module } from '@nestjs/common';

@Module({
   providers: [
      {
         provide: 'EVENT_OUTBOX_PUBLISHER',
         useValue: {
            publish: jest.fn(),
         },
      },
   ],
   exports: ['EVENT_OUTBOX_PUBLISHER'],
})
export class MockEventOutboxModule { }