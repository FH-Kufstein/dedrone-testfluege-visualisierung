import { getFilesRecursively, writeFile } from '.';
import { FileCollection } from './file-collection';
import { Parser, AnafiParser, BlueRacoonParser } from './parsing';
import { Point, Segment, Track, Metadata } from 'gpx-builder/dist/builder/BaseBuilder/models';
import { buildGPX, BaseBuilder } from 'gpx-builder';

const anafi_path: string = 'raw-data/AnafiExport';
const br_path: string = 'raw-data/deDrone Log Export BlueRacoon';
// const gpx_path: string = 'raw-data/DeDrone Log';

const anafi_files: FileCollection = getFilesRecursively(anafi_path);
const br_files: FileCollection = getFilesRecursively(br_path);
// const gpx_files: FileCollection = getFilesRecursively(gpx_path);

const anafi_trk: Record<string, Track> = readPoints(anafi_files, anafi_path, new AnafiParser());
const br_trk: Record<string, Track> = readPoints(br_files, br_path, new BlueRacoonParser());

writeTracks('anafi', anafi_trk);
writeTracks('br', br_trk);
// writePoints('gpx', gpx_trk);

function readPoints(files: FileCollection, path: string, parser: Parser): Record<string, Track> {
    const tracks: Record<string, Track> = { };

    Object.keys(files).forEach((key: string) => {
        if (files[key].length > 0) {
            const points: Point[] = [];

            files[key].forEach(file => {
                parser.read(`${path}/${key}/${file}`).forEach(point => {
                    points.push(point);
                });
            });

            tracks[key] = new Track([new Segment(points)]);
        }
    });

    return tracks;
}

function writeTracks(filename: string, tracks: Record<string, Track>): void {
    Object.keys(tracks).forEach((key: string) => {
        if (Object.values(tracks[key].toObject()).length > 0) {
            const gpxData = new BaseBuilder();
            const md = new Metadata({
                name: 'Drone data',
                time: new Date()
            });
            gpxData.setMetadata(md);
            gpxData.setTracks([tracks[key]]);
            writeFile(`docs/data/${key}/${filename}.gpx`, buildGPX(gpxData.toObject()));
        }
    });
}