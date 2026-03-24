import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';


@Injectable()
export class HttpService {

   constructor(private configService: ConfigService) {}
   
   async get(url: string) {
      const res = await axios.get(url, {
         headers: {
            'x-internal-api-key': this.configService.get('INTERNAL_API_KEY'),
         },
      });
      return res.data;
   }
}