import { Controller, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Planets } from './planets';
import { PlanetsService } from './planets.service';

@ApiTags('planets')
@Controller('planets')
export class PlanetsController {

    private readonly logger = new Logger(PlanetsController.name);

    constructor(private readonly planetsService: PlanetsService) { }

    @Get()
    async getAll(@Query('limit', ParseIntPipe) limit: number): Promise<Planets[]> {
        try {
            const result = await this.planetsService.getAll(limit);
            this.logger.log(`Get All Planets : ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':planetId')
    async getById(@Param('planetId', ParseIntPipe) id: number): Promise<Planets> {
        if (!(id > 0))
            throw new HttpException('Param id should be greater than 0', HttpStatus.BAD_REQUEST);
        try {
            const result = await this.planetsService.getById(id);
            this.logger.log(`Get Planets By Id : ${JSON.stringify(result)}`);
            return result;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
