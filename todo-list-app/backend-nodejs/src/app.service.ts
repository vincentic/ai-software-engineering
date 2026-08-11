import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'i am your todo list 1 service by nest js';
  }
}
