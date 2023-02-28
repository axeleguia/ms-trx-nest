import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {

  constructor() { }

  @Get()
  @Redirect('/api')
  getStarted(): string {
    return 'Redirect to Swagger API';
  }

}
