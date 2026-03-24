import { Module } from '@nestjs/common';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { HttpService } from '../../common/http/http.service';


@Module({
   providers: [
      EventResolver,
      EventService,
      HttpService
   ],
})
export class EventModule { }