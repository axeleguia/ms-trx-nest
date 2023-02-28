import { GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { SwapiService } from './../swapi/swapi.service';
import { dynamoClient } from './../util/dynamo-client';
import { People } from './people';
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

@Injectable()
export class PeopleService {

    private readonly logger = new Logger(PeopleService.name);

    constructor(private swapiService: SwapiService) { }

    async getAll(limit?: number): Promise<People[]> {
        try {
            return await this.swapiService.getPeople(limit);
        } catch (error) {
            this.logger.error(`Exception getAll(): ${error.message}`);
            throw error;
        }
    }

    async getById(id: number): Promise<People> {
        try {
            // Check in DB
            const getCommand: GetItemCommandInput = {
                TableName: "people",
                Key: {
                    "id": { N: `${id}` }
                }
            };
            const req = await dynamoClient.send(new GetItemCommand(getCommand));
            if (req.Item) {
                return unmarshall(req.Item) as People;
            } else {
                // Check in Swapi then Store value in dynamo
                const people = await this.swapiService.getPeopleById(id);
                if (people) {
                    people.id = id;
                    const putCommand: PutItemCommandInput = {
                        TableName: "people",
                        Item: marshall({ ...people })
                    };
                    await dynamoClient.send(new PutItemCommand(putCommand));
                }
                return people;
            }
        } catch (error) {
            this.logger.error(`Exception getById(): ${error.message}`);
            throw error;
        }
    }

    async add(people: People): Promise<People> {
        try {
            // Check in DB
            people.id = people.id + 10000; // To no collapse with Swapi ids
            const getCommand: GetItemCommandInput = {
                TableName: "people",
                Key: {
                    "id": { N: `${people.id}` }
                }
            };
            const req = await dynamoClient.send(new GetItemCommand(getCommand));
            this.logger.log(`On Add - Get People: ${JSON.stringify(req.Item)}`);
            if (req.Item) {
                // Update in dynamo
                const updateCommand: UpdateItemCommandInput = {
                    TableName: "people",
                    Key: {
                        "id": { N: `${people.id}` }
                    },
                    UpdateExpression: `set #name = :name, birth_year = :birth_year, eye_color = :eye_color, 
                                       gender = :gender, hair_color = :hair_color, height = :height, 
                                       homeworld = :homeworld, mass = :mass, skin_color = :skin_color,
                                       created = :created, edited = :edited, #url = :url`,
                    ExpressionAttributeValues: {
                        ":name": { 'S': people.name },
                        ":birth_year": { 'S': people.birth_year },
                        ":eye_color": { 'S': people.eye_color },
                        ":gender": { 'S': people.gender },
                        ":hair_color": { 'S': people.hair_color },
                        ":height": { 'S': people.height },
                        ":homeworld": { 'S': people.homeworld },
                        ":mass": { 'S': people.mass },
                        ":skin_color": { 'S': people.skin_color },
                        ":created": { 'S': people.created },
                        ":edited": { 'S': people.edited },
                        ":url": { 'S': people.url },
                    },
                    ExpressionAttributeNames: {
                        "#name": "name",
                        "#url": "url"
                    }
                };
                await dynamoClient.send(new UpdateItemCommand(updateCommand));
                this.logger.log(`On Add - Updated People: ${JSON.stringify(people)}`);
                return people;
            } else {
                // Store value in dynamo
                const putCommand: PutItemCommandInput = {
                    TableName: "people",
                    Item: marshall({ ...people })
                };
                await dynamoClient.send(new PutItemCommand(putCommand));
                this.logger.log(`On Add - Put People: ${people}`);
                return people;
            }
        } catch (error) {
            this.logger.error(`Exception add(): ${error.message}`);
            throw error;
        }
    }

}
