import { Parser } from './parser';
import { Position } from '../../models';
import * as fs from 'fs';

export class BlueRacoonParser implements Parser {
    constructor() { }

    read(fqp: string): Position[] {
        const positions: Position[] = [];

        try {
            const data: any = fs.readFileSync(fqp, 'utf8');
            let contents: any = JSON.parse(JSON.parse(data)).data.detections[0];
    
            if (contents.positions && contents.identification) {
                let droneName: string = '';
    
                if (contents.identification.manufacturer) droneName += contents.identification.manufacturer + ' ';
                if (contents.identification.model) droneName += contents.identification.model + ' ';
                if (contents.identification.protocol) droneName += contents.identification.protocol;
    
                if (contents.positions.length > 0) {
                    contents.positions.map((value: any) => {
                        if (value && value != 'null') {
                            let p = new Position(droneName, new Date(value.timestamp), value.longitude, value.latitude, value.altitude);
                            positions.push(p);
                        }
                    });
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    
        return positions;
    }
}