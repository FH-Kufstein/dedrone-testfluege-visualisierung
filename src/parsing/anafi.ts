import * as fs from 'fs';
import { Parser } from './parser';
import { Point } from 'gpx-builder/dist/builder/BaseBuilder/models';

export class AnafiParser implements Parser {
    constructor() { }

    read(fqp: string): Point[] {
        const points: Point[] = [];

        try {
            const data = fs.readFileSync(fqp, 'utf8');
    
            const contents: any = JSON.parse(data);
        
            const droneName: string = contents.product_name;
            const ts: Date = this.cleanDt(contents.date);
    
            contents.details_data.map((value: any) => {
                if (value) {
                    const pt = new Point
                    (
                        value[8], value[9],
                        {
                            ele: value[18],
                            time: new Date(ts + value[0]),
                            name: droneName
                        }
                    );
                    points.push(pt);
                }
            });
        }
        catch(err) {
            console.log(err);
        }
    
        return points;
    }

    cleanDt(datetime: string) {
        //should conform to ISO-8601
    
        //2021-06-16T152033+0200
        let formattedDate: string = datetime.slice(0, 11) + datetime.slice(11, 13) + ':' + datetime.slice(13, 15) + ':' + datetime.slice(15, 17) + datetime.slice(17, 20) + ':' + datetime.slice(20, 22);
    
        return new Date(formattedDate);
    }
}