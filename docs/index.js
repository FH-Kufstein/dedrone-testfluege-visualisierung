const map = L.map('map', {
    center: [47.15148, 10.746726],
    zoom: 17,
    minZoom: 15,
    maxZoom: 20
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGF0cmlrOTgiLCJhIjoiY2txODN1cTAzMDFoMTJ1bHdtZnFkNnZrNiJ9.NyRH5elqV89-RTSJUp3Dkw'
}).addTo(map);

const sensor_positions = [
    [47.151955, 10.746188],
    [47.151291, 10.747304],
    [47.1509223, 10.7462742],
    [47.151956, 10.746218]
];

const sensor_icon = L.icon({
    iconUrl: 'sensor.png',
    iconSize:     [25, 20], // size of the icon
    iconAnchor:   [12, 10], // point of the icon which will correspond to marker's location
});

const sensor_markers = L.layerGroup();
sensor_positions.map(pos => {
   L.marker(pos, {icon: sensor_icon}).addTo(sensor_markers);
});

let endpoints = {};
const filenames = ['anafi.gpx', 'br.gpx', 'dd.gpx'];

// prepare endpoints manually
for (let i = 0; i < 9; i++) {
    const tmp = [];
    filenames.forEach(filename => {
        tmp.push(`t${i + 1}/${filename}`);
    });
    endpoints[`t${i + 1}`] = tmp;
}

exec(endpoints)
.then(overlays => {
    overlays['sensors'] = sensor_markers;
    L.control.layers(null, overlays).addTo(map);
});

async function exec(endpoints) {
    const overlays = { };

    for (const key of Object.keys(endpoints)) {
        const data_per_test = [];

        for (const endpoint of Object.values(endpoints[key])) {
            const data = await getData(endpoint);
            data_per_test.push(data);
        }

        if (data_per_test.length > 0) {
            const layerGroup = await generateLayers(data_per_test);
            if (layerGroup.getLayers().length > 0) {
                // drawLayers(layerGroup);
                overlays[key] = layerGroup;
            }
        }
    }

    return Promise.resolve(overlays);
}

// generate layers per test, one layer per file in corresponding test folder
async function generateLayers(data) {
    const layerGroup = L.layerGroup();

    const gpx_options = function(color) {
        return {
            async: true,
            marker_options: {
                startIconUrl: '',
                endIconUrl: '',
                shadowUrl: ''
            },
            polyline_options: {
                color: `${color}`,
                opacity: 1,
                weight: 4,
                lineCap: 'round'
            }
        }
    }

    const colors = ['white', 'lightgrey', 'darkblue'];

    if (data && Array.isArray(data)) {
        for (const gpx of data) {
            const idx = data.indexOf(gpx);
            const layer = new L.GPX(gpx, gpx_options(colors[idx]));
            layer.addTo(layerGroup);
        }
    }

    return Promise.resolve(layerGroup);
}

async function getData(endpoint) {
    try {
        const res = await fetch(`./data/${endpoint}`)

        if (res.ok) {
            const data = await res.text();
            return Promise.resolve(data);
        }
    }
    catch(err) {
        console.log(err);
        return Promise.reject(err);
    }
}