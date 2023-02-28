import { Exclude, Expose } from "class-transformer";

@Exclude()
export class Planets {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    climate: string;
    @Expose()
    diameter: string;
    @Expose()
    gravity: string;
    @Expose()
    population: string;
    @Expose()
    residents: string;
    @Expose()
    terrain: string;
    @Expose()
    url: string;
}