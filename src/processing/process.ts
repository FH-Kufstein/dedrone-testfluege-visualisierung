import { getFilesRecursively, writeFile } from '.';
import { FileCollection } from './file-collection';
import { Point, Segment, Track } from 'gpx-builder/dist/builder/BaseBuilder/models';
import { Parser, AnafiParser, BlueRacoonParser, DedroneParser } from '../parsing';

const anafi_path: string = 'raw-data/AnafiExport';
const br_path: string = 'raw-data/deDrone Log Export BlueRacoon';
const dd_path: string = 'raw-data/DeDrone Log';

const anafi_files: FileCollection = getFilesRecursively(anafi_path);
const br_files: FileCollection = getFilesRecursively(br_path);
const dd_files: FileCollection = getFilesRecursively(dd_path);

const anafi_trk: Record<string, Track> = readPoints(anafi_files, anafi_path, new AnafiParser());
const br_trk: Record<string, Track> = readPoints(br_files, br_path, new BlueRacoonParser());
const dd_trk: Record<string, Track> = readPoints(dd_files, dd_path, new DedroneParser());

writeFiles('anafi', anafi_trk);
writeFiles('br', br_trk);
writeFiles('dd', dd_trk);

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

            const segment: Segment= new Segment(points);
            tracks[key] = new Track([segment]);
        }
    });

    return tracks;
}

function writeFiles(filename: string, tracks: Record<string, Track>): void {
    Object.keys(tracks).forEach((key: string) => {
        const gpx = Parser.serialize(tracks[key]);
        writeFile(`docs/data/${key}/${filename}.gpx`, gpx);
    });
}