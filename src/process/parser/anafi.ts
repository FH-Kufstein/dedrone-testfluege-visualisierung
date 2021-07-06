import { Parser } from './parser';
import { Position } from '../../models';
import * as fs from 'fs';

export class AnafiParser implements Parser {
    constructor() { }

    read(fqp: string): Position[] {
        const positions: Position[] = [];

        try {
            const data = fs.readFileSync(fqp, 'utf8');
    
            const contents: any = JSON.parse(data);
        
            const droneName: string = contents.product_name;
            const ts: Date = this.cleanDt(contents.date);
    
            contents.details_data.map((value: any) => {
                if (value) {
                    let p = new Position(droneName, new Date(ts + value[0]), value[8], value[9], value[18]);
                    positions.push(p);
                }
            });
        }
        catch(err) {
            console.log(err);
        }
    
        return positions;
    }

    cleanDt(datetime: string) {
        //should conform to ISO-8601
    
        //2021-06-16T152033+0200
        let formattedDate: string = datetime.slice(0, 11) + datetime.slice(11, 13) + ':' + datetime.slice(13, 15) + ':' + datetime.slice(15, 17) + datetime.slice(17, 20) + ':' + datetime.slice(20, 22);
    
        return new Date(formattedDate);
    }
}