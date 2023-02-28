import { GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { SwapiService } from './../swapi/swapi.service';
import { dynamoClient } from './../util/dynamo-client';
import { Planets } from './planets';
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

@Injectable()
export class PlanetsService {

    private readonly logger = new Logger(PlanetsService.name);

    constructor(private swapiService: SwapiService) { }

    async getAll(limit?: number): Promise<Planets[]> {
        try {
            return await this.swapiService.getPlanets(limit);
        } catch (error) {
            this.logger.error(`Exception getAll(): ${error.message}`);
            throw error;
        }
    }

    async getById(id: number): Promise<Planets> {
        try {
            // Check in DB
            const getCommand: GetItemCommandInput = {
                TableName: "planets",
                Key: {
                    "id": { N: `${id}` }
                }
            };
            const req = await dynamoClient.send(new GetItemCommand(getCommand));
            if (req.Item) {
                return unmarshall(req.Item) as Planets;
            } else {
                // Check in Swapi then Store value in dynamo
                const planet = await this.swapiService.getPlanetsById(id);
                if (planet) {
                    planet.id = id;
                    const putCommand: PutItemCommandInput = {
                        TableName: "planets",
                        Item: marshall({ ...planet })
                    };
                    await dynamoClient.send(new PutItemCommand(putCommand));
                }
                return planet;
            }
        } catch (error) {
            this.logger.error(`Exception getById(): ${error.message}`);
            throw error;
        }
    }
}
