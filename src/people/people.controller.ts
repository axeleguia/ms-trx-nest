import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { People } from './people';
import { PeopleService } from './people.service';

@ApiTags('people')
@Controller('people')
export class PeopleController {

  private readonly logger = new Logger(PeopleController.name);

  constructor(
    private readonly peopleService: PeopleService
  ) { }

  @Get()
  async getAll(@Query('limit', ParseIntPipe) limit: number): Promise<People[]> {
    try {
      const result = await this.peopleService.getAll(limit);
      this.logger.log(`Get All People : ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Exception getAll(): ${JSON.stringify(error.message)}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':personId')
  async getById(@Param('personId', ParseIntPipe) id: number): Promise<People> {
    if (!(id > 0))
      throw new HttpException('Param id should be greater than 0', HttpStatus.BAD_REQUEST);
    try {
      const result = await this.peopleService.getById(id);
      this.logger.log(`Get People By Id : ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Exception getAll(): ${JSON.stringify(error.message)}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async add(@Body() people: People): Promise<People> {
    try {
      return await this.peopleService.add(people);
    } catch (error) {
      this.logger.error(`Exception add(): ${JSON.stringify(error.message)}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
