// script for parsing and writing Parrot ANAFI positional data

const fs = require('fs');
var Position = require('./Position');

const anafi_path = 'raw-data/AnafiExport/';

// first test with PARROT ANAFI was t3 on 16.06.
const anafi_t3_files = ['0914_2021-06-16T152033+0200_A708D5_0028'];

// rest of the tests were on 17.06., t7 - t9
const anafi_t7_files = ['0914_2021-06-17T110508+0200_5C5F83_0029', '0914_2021-06-17T110527+0200_8566BB_002A', '0914_2021-06-17T110533+0200_D1A46E_002B'];
const anafi_t8_files = ['0914_2021-06-17T120340+0200_F2C686_002C'];
const anafi_t9_files = ['0914_2021-06-17T140634+0200_6E14D2_002D', '0914_2021-06-17T140855+0200_DB0B56_002E'];

let anafi_t3_positions = [];
let anafi_t7_positions = [];
let anafi_t8_positions = [];
let anafi_t9_positions = [];

anafi_t3_files.map(filename => {
    readAnafiExport(filename).map(position => {
        anafi_t3_positions.push(position);
    });
});

anafi_t7_files.map(filename => {
    readAnafiExport(filename).map(position => {
        anafi_t7_positions.push(position);
    });
});

anafi_t8_files.map(filename => {
    readAnafiExport(filename).map(position => {
        anafi_t8_positions.push(position);
    });
});

anafi_t9_files.map(filename => {
    readAnafiExport(filename).map(position => {
        anafi_t9_positions.push(position);
    });
});

writeFile('docs/data/t3/gt/t3.json', anafi_t3_positions);
writeFile('docs/data/t7/gt/t7.json', anafi_t7_positions);
writeFile('docs/data/t8/gt/t8.json', anafi_t8_positions);
writeFile('docs/data/t9/gt/t9.json', anafi_t9_positions);

function readAnafiExport(filename) {
    const positions = [];

    try {
        const data = fs.readFileSync(`${anafi_path}${filename}.json`, 'utf8');

        let contents = JSON.parse(data);
    
        const droneName = contents.product_name;
        const ts = cleanDt(contents.date);

        contents.details_data.map((value) => {
            if (value) {
                let p = new Position(droneName, new Date(ts + value[0]), value[8], value[9], value[18]);
                positions.push(p);
            }
        });
    }
    catch (err) {
        console.error(err);
    }

    return positions;
}

function writeFile(fqp, contents) {
    fs.writeFile(fqp, JSON.stringify(contents), (err) => {
        if (fqp == null || contents == null || contents == '') {
            console.log('error');
        }
        if (err) {
            console.log(`error: ${err}`);
        }

        console.log('' + fqp + ' written!');
    });
}

function cleanDt(datetime) {
    //should conform to ISO-8601

    //2021-06-16T152033+0200
    let formattedDate = datetime.slice(0, 11) + datetime.slice(11, 13) + ':' + datetime.slice(13, 15) + ':' + datetime.slice(15, 17) + datetime.slice(17, 20) + ':' + datetime.slice(20, 22);

    return new Date(formattedDate);
}