export class Position {
    name: string;
    ts: Date;
    lon: number;
    lat: number;
    alt: number;

    constructor(name: string, ts: Date, lon: number, lat: number, alt: number) {
        this.name = name;
        this.ts = ts;
        this.lon = lon;
        this.lat = lat;
        this.alt = alt;
    }
}