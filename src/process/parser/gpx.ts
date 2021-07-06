import { Parser } from './parser';
import { Position } from '../../models';
import * as fs from 'fs';

export class GpxParser implements Parser {
    constructor() { }
    
    read(fqp: string): Position[] {
        const positions: Position[] = [];

        try {

        }
        catch(err) {
            console.log(err);
        }

        return positions;
    }
}