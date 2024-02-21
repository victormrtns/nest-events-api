import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {

    return process.env.DB_HOST;
  }
}
