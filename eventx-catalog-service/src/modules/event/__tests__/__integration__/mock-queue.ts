import { Module } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';

// 1. Define a Mock Module that EXPORTS the missing token
@Module({
   providers: [{
      provide: getQueueToken('event-image-queue'),
      useValue: {
         add: jest.fn(),
         process: jest.fn(),
         close: jest.fn(),
      },
   }],
   exports: [getQueueToken('event-image-queue')], // <--- Crucial: Make it visible to EventModule
})

export class MockQueueModule { }