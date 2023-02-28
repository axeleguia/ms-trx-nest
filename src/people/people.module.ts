import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SwapiService } from './../swapi/swapi.service';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
    imports: [HttpModule],
    providers: [PeopleService, SwapiService],
    controllers: [PeopleController]
})
export class PeopleModule { }
