import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { PeopleModule } from './people/people.module';
import { PlanetsModule } from './planets/planets.module';
import { SwapiService } from './swapi/swapi.service';

@Module({
  imports: [
    LoggerModule.forRoot(),
    PeopleModule,
    PlanetsModule
  ],
  controllers: [AppController],
  providers: [SwapiService],
})
export class AppModule { }
