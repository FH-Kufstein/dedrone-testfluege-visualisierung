import { buildGPX, BaseBuilder } from 'gpx-builder';
import { Point, Track, Metadata } from 'gpx-builder/dist/builder/BaseBuilder/models';

export abstract class Parser {
    constructor() { }
    
    abstract read(fqp: string): Point[];

    static serialize(track: Track) {
        const gpxData: BaseBuilder = new BaseBuilder();
        const md: Metadata = new Metadata(
            { 
                name: 'Taaja',
                desc: 'Processed GPX data from drone flights',
                time: new Date()
            }
        )
        gpxData.setMetadata(md);
        gpxData.setTracks([track]);

        return buildGPX(gpxData.toObject());
    }
}