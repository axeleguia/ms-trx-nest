import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SwapiService } from './../swapi/swapi.service';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';

@Module({
    imports: [HttpModule],
    providers: [PlanetsService, SwapiService],
    controllers: [PlanetsController]
})
export class PlanetsModule { }
