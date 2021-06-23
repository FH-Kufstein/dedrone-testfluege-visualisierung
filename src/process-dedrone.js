// script for parsing and writing Dedrone positional data

const path = require('path');
const fs = require('fs');
var Position = require('./Position');

const dedrone_path = 'raw-data/deDrone Log Export BlueRacoon/';
let dedrone_files = [];

function discover() {
    fs.readdirSync(dedrone_path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map((dirent, index) => {
        const path = dedrone_path + dirent.name;
        dedrone_files[index] = [];

        const files = fs.readdirSync(path);
        files.map(name => {
            const fqp = path + '/' + name;
            const size = fs.statSync(fqp).size;

            //many files are have only 'null' as content, only add useful files by checking size (bytes)
            if (size > 100) {
                dedrone_files[index].push(fqp);
            }
        });
    });
}
  
discover();
console.log('' + dedrone_files.length + ' dedrone paths discovered.');

let positions = [];
dedrone_files.map((files, index) => {
    positions[index] = [];
    files.map(file => {
        const pos = readDedroneExport(file);

        if (pos.length > 0) {
            positions[index].push(pos);
        }
    });
});

positions.map((pos, index) => {
    const fqp = `docs/data/t${index + 1}/meas/t${index + 1}.json`;
    writeFile(fqp, pos);
});

function readDedroneExport(filename) {
    const positions = [];

    try {
        const data = fs.readFileSync(`${filename}`, 'utf8');
        let contents = JSON.parse(JSON.parse(data)).data.detections[0];

        if (contents.positions && contents.identification) {
            let droneName = '';

            if (contents.identification.manufacturer) droneName += contents.identification.manufacturer + ' ';
            if (contents.identification.model) droneName += contents.identification.model + ' ';
            if (contents.identification.protocol) droneName += contents.identification.protocol;

            if (contents.positions.length > 0) {
                contents.positions.map((value) => {
                    // console.log(value);
                    if (value && value != 'null') {
                        let p = new Position(droneName, new Date(value.timestamp), value.longitude, value.latitude, value.altitude);
                        positions.push(p);
                    }
                });
            }
        }
    }
    catch (err) {
        console.error(err);
    }

    return positions;
}

function writeFile(fqp, contents) {
    fs.writeFile(fqp, JSON.stringify(contents), (err) => {
        if (fqp == null || contents == null) {
            console.log('error');
        }
        if (err) {
            console.log(`error: ${err}`);
        }

        console.log('' + fqp + ' written!');
    });
}