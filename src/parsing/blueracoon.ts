import * as fs from 'fs';
import { Parser } from './parser';
import { Point } from 'gpx-builder/dist/builder/BaseBuilder/models';

export class BlueRacoonParser extends Parser {
    constructor() { super(); }

    //custom json
    read(fqp: string): Point[] {
        const points: Point[] = [];

        try {
            const data: any = fs.readFileSync(fqp, 'utf8');
            const contents: any = JSON.parse(JSON.parse(data)).data.detections[0];
    
            if (contents.positions && contents.identification) {
                let droneName: string = '';
    
                if (contents.identification.manufacturer) droneName += contents.identification.manufacturer + ' ';
                if (contents.identification.model) droneName += contents.identification.model + ' ';
                if (contents.identification.protocol) droneName += contents.identification.protocol;
    
                if (contents.positions.length > 0) {
                    contents.positions.map((value: any) => {
                        if (value && value != 'null') {
                            const pt: Point = new Point(
                                value.latitude, value.longitude,
                                {
                                    ele: value.ele,
                                    time: new Date(value.timestamp),
                                    name: droneName
                                }
                            )
                            points.push(pt);
                        }
                    });
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    
        return points;
    }
}