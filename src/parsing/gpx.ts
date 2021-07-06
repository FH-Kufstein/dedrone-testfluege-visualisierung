import * as fs from 'fs';
import { Parser } from './parser';
import { Point } from 'gpx-builder/dist/builder/BaseBuilder/models';

export class GpxParser implements Parser {
    constructor() { }
    
    read(fqp: string): Point[] {
        const points: Point[] = [];

        try {
            const data = fs.readFileSync(fqp, 'utf8');
        }
        catch(err) {
            console.log(err);
        }

        return points;
    }
}