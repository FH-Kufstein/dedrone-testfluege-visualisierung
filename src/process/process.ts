import { getFilesRecursively, writeFile } from '.';
import { PositionCollection } from '../models';
import { Parser, AnafiParser, DedroneParser } from '.';
import { FileCollection } from './file-collection';

const anafi_path: string = 'raw-data/AnafiExport';
const dedrone_path: string = 'raw-data/deDrone Log Export BlueRacoon';

const anafi_files: FileCollection = getFilesRecursively(anafi_path);
const dedrone_files: FileCollection = getFilesRecursively(dedrone_path);

const anafi_pos: PositionCollection = getPositions(anafi_files, anafi_path, new AnafiParser());
const dedrone_pos: PositionCollection = getPositions(dedrone_files, dedrone_path, new DedroneParser());

writePositions('gt', anafi_pos);
writePositions('meas', dedrone_pos);

function getPositions(files: FileCollection, path: string, parser: Parser): PositionCollection {
    const positions: PositionCollection = { };

    Object.keys(files).forEach((key: string) => {
        positions[key] = [];

        if (files[key].length > 0) {
            files[key].forEach(file => {
                const tmp = parser.parse(`${path}/${key}/${file}`);
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