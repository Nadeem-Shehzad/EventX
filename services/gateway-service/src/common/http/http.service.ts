import { Injectable } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class HttpService {
  async get(url: string) {
    const res = await axios.get(url);
    return res.data;
  }
}