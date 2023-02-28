import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { People } from './../people/people';
import { Planets } from './../planets/planets';

@Injectable()
export class SwapiService {

    private readonly logger = new Logger(SwapiService.name);

    constructor() { }

    async getPeople(limit?: number): Promise<People[]> {
        try {
            let peoples = [] as People[];
            let nextUrl = `https://swapi.dev/api/people/?page=1`;
            while (nextUrl) {
                const response = await axios.get(nextUrl);
                if (response.data.results.length > 0)
                    peoples = [...peoples, ...response.data.results];
                // Break while if limit in between query range
                if (limit!) {
                    let uri = new URL(nextUrl);
                    let page = uri.searchParams.get('page');
                    if ((Number(page) - 1) * 10 < limit && limit < Number(page) * 10) {
                        peoples = [...peoples.slice(0, limit)];
                        break;
                    }
                }
                nextUrl = response.data.next;
            }
            return plainToInstance(People, peoples, { enableImplicitConversion: true });
        } catch (error) {
            this.logger.error(`Exception getPeople(): ${error.message}`);
            throw error;
        }
    }

    async getPeopleById(id: number): Promise<People> {
        try {
            const response = await axios.get(`https://swapi.dev/api/people/${id}`);
            return plainToInstance(People, response.data, { enableImplicitConversion: true });
        } catch (error) {
            this.logger.error(`Exception getPeopleById(): ${error.message}`);
            throw error;
        }
    }

    async getPlanets(limit?: number): Promise<Planets[]> {
        try {
            let planets = [] as People[];
            let nextUrl = `https://swapi.dev/api/planets/?page=1`;
            while (nextUrl) {
                const response = await axios.get(nextUrl);
                if (response.data.results.length > 0)
                    planets = [...planets, ...response.data.results];
                // Break while if limit in between query range
                if (limit!) {
                    let uri = new URL(nextUrl);
                    let page = uri.searchParams.get('page');
                    if ((Number(page) - 1) * 10 < limit && limit < Number(page) * 10) {
                        planets = [...planets.slice(0, limit)];
                        break;
                    }
                }
                nextUrl = response.data.next;
            }
            return plainToInstance(Planets, planets, { enableImplicitConversion: true });
        } catch (error) {
            this.logger.error(`Exception getPlanets(): ${error.message}`);
            throw error;
        }
    }

    async getPlanetsById(id: number): Promise<Planets> {
        try {
            const response = await axios.get(`https://swapi.dev/api/planets/${id}`);
            return plainToInstance(Planets, response.data, { enableImplicitConversion: true });
        } catch (error) {
            this.logger.error(`Exception getPlanetsById(): ${error.message}`);
            throw error;
        }
    }

}