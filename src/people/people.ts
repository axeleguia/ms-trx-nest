import { Exclude, Expose } from "class-transformer";

@Exclude()
export class People {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    birth_year: string;
    @Expose()
    eye_color: string;
    @Expose()
    gender: string;
    @Expose()
    hair_color: string;
    @Expose()
    height: string;
    @Expose()
    homeworld: string;
    @Expose()
    mass: string;
    @Expose()
    skin_color: string;
    @Expose()
    created: string;
    @Expose()
    edited: string;
    @Expose()
    url: string;
}