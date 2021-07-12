import * as fs from 'fs';
import { Parser } from './parser';
import  * as xml2json from 'xml2json';
import { Point } from 'gpx-builder/dist/builder/BaseBuilder/models';

export class DedroneParser extends Parser {

    constructor() {
        super();
    }
    
    //gpx
    read(fqp: string): Point[] {
        const points: Point[] = [];

        try {
            const xml: string = fs.readFileSync(fqp, 'utf8');

            const options: xml2json.JsonOptions = {
                reversible: false,
                coerce: true,
                sanitize: true,
                trim: true,
                arrayNotation: false
            };

            const raw: string = xml2json.toJson(xml, options);
            const json: Record<string, any> = JSON.parse(raw);

            if (json.gpx) {
                if (json.gpx.trk) {
                    if (!Array.isArray(json.gpx.trk) && json.gpx.trk.trkseg.trkpt) {
                        const trkpt = json.gpx.trk.trkseg.trkpt;
                        trkpt.forEach((point: Record<string, any>) => {
                            if (point) {
                                const pt = new Point(
                                    point.lat, point.lon,
                                    {
                                        time: new Date(point.time)
                                    }
                                );
                                points.push(pt);
                            }
                        });
                    }
                }
            }
        }
        catch(err) {
            console.log(err);
        }

        return points;
    }
}