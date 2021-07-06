import { getFilesRecursively, writeFile } from '.';
import { PositionCollection } from '../models';
import { Parser, AnafiParser, BlueRacoonParser } from './parser';
import { FileCollection } from './file-collection';

const anafi_path: string = 'raw-data/AnafiExport';
const br_path: string = 'raw-data/deDrone Log Export BlueRacoon';
// const gpx_path: string = 'raw-data/DeDrone Log';

const anafi_files: FileCollection = getFilesRecursively(anafi_path);
const br_files: FileCollection = getFilesRecursively(br_path);
// const gpx_files: FileCollection = getFilesRecursively(gpx_path);

const anafi_pos: PositionCollection = getPositions(anafi_files, anafi_path, new AnafiParser());
const br_pos: PositionCollection = getPositions(br_files, br_path, new BlueRacoonParser());
// const gpx_pos: PositionCollection = getPositions(gpx_files, gpx_path, new DedroneGpxParser());

writePositions('anafi', anafi_pos);
writePositions('br', br_pos);
// writePositions('gpx', gpx_pos);

function getPositions(files: FileCollection, path: string, parser: Parser): PositionCollection {
    const positions: PositionCollection = { };

    Object.keys(files).forEach((key: string) => {
        positions[key] = [];

        if (files[key].length > 0) {
            files[key].forEach(file => {
                const tmp = parser.read(`${path}/${key}/${file}`);
                positions[key] = positions[key].concat(tmp);
            });
        }
    });

    return positions;
}

function writePositions(filename: string, positions: PositionCollection) {
    Object.keys(positions).forEach((key: string) => {
        if (positions[key].length > 0) {
            writeFile(`docs/data/${key}/${filename}.json`, positions[key]);
        }
    });
}