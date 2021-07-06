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

var sensor_icon = L.icon({
    iconUrl: 'sensor.png',
    iconSize:     [25, 20], // size of the icon
    iconAnchor:   [12, 10], // point of the icon which will correspond to marker's location
});

sensor_positions.map(pos => {
    L.marker(pos, {icon: sensor_icon}).addTo(map);
});

prepareLayers().then(overlays => {
    L.control.layers(null, overlays).addTo(map);
});

async function prepareLayers() {
    let overlays = {};

    for (let i = 1; i < 10; i++) {
        const tag = `t${i}`;
    
        const data = await getData(tag);
        const gt = data[0];
        const meas = data[1];

        const gt_latlngs = gt.map((pos) => {
            return [pos.lat, pos.lon];
        });
    
        const meas_latlngs = meas.map((pos) => {
            return [pos.lat, pos.lon];
        });

        const gt_pl = drawPolyline(gt_latlngs, 'blue');
        const meas_pl = drawPolyline(meas_latlngs, 'red');

        const layerGroup = L.layerGroup();

        if (gt_pl) {
            gt_pl.addTo(layerGroup);
        }

        if (meas_pl) {
            meas_pl.addTo(layerGroup);
        }

        if (layerGroup.getLayers().length > 0) {
            overlays[tag] = layerGroup;
        }
    }

    return overlays;
}

async function getData(tag) {
    let gt = [];
    let meas = [];

    if (tag != null || tag != '') {
        let r1 = await fetch(`./data/${tag}/gt.json`);
        let r2 = await fetch(`./data/${tag}/meas.json`);
    
        if (r1.ok) gt = await r1.json();
        if (r2.ok) meas = await r2.json();
    }

    return [gt, meas];
}

function drawPolyline(latlngs, color) {
    let polyline = null;

    if (latlngs.length > 0) {
        const options = {
            color: color,
            weight: 1
        }

        polyline = new L.Polyline(latlngs, options);
    }

    return polyline;
}