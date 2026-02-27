import { Global, Module } from '@nestjs/common';
import { RabbitMQModule, MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
   imports: [
      RabbitMQModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('RABBITMQ_URI')!,
            exchanges: [
               { name: 'eventx.events', type: 'topic' },
               { name: 'eventx.dlx', type: 'topic' },
            ],
            connectionInitOptions: { wait: true },
            defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
            channels: {
               'channel-main': {
                  prefetchCount: 1,
                  default: true,
               },
            },
         }),
      }),
   ],
   exports: [RabbitMQModule],
})

export class RabbitMQConfigModule { }