import * as path from 'path';
import * as fs from 'fs';
import { FileCollection } from './file-collection';

export function getFilesRecursively(dir: string): FileCollection {
    let fileCollection: FileCollection = { };
    const filesInDirectory: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });

    filesInDirectory.map((file) => {
        const absolute: string = path.join(dir, file.name);

        if (file.isDirectory()) {
            let files_arr: string[] = getFilesRecursively(absolute)[file.name];

            if (files_arr == undefined) {
                files_arr = [];
            }

            fileCollection[file.name] = files_arr;
        }
        else {
            const subDir = path.basename(path.dirname(absolute));

            if (subDir != undefined) {
                if (fileCollection[subDir] == undefined) {
                    fileCollection[subDir] = [];
                }
            }
              //many files are have only 'null' as content, only add useful files by checking size (bytes)
            if (checkSize(absolute) > 100) {
                fileCollection[subDir].push(file.name);
            }
        }
    });

    return fileCollection;
}

export function writeFile(fqp: string, contents: string): void {
    fs.writeFileSync(fqp, contents);
    console.log(`${fqp} written!`);
}

function checkSize(file: string): number {
    return fs.statSync(file).size;
}