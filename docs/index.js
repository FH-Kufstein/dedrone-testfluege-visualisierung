// const boundaries = [[47.584724, 12.171843], [47.583015, 12.174000]];

const map = L.map('map', {
    center: [47.15148, 10.746726],
    zoom: 17,
    minZoom: 16,
    maxZoom: 18
})

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
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

getData('t3')
.then(data => {
    const gt = data[0];
    const meas = data[1];

    const gt_latlngs = gt.map((pos) => {
        return [pos.lat, pos.lon];
    });

    const meas_latlngs = meas.map((pos) => {
        return [pos.lat, pos.lon];
    });

    const gt_polyline_options = {
        color: 'blue',
        weight: 1
    };

    const meas_polyline_options = {
        color: 'red',
        weight: 1
    };

    console.log(gt);
    console.log(meas);

    const gt_polyline = new L.Polyline(gt_latlngs, gt_polyline_options);
    const meas_polyline = new L.polyline(meas_latlngs, meas_polyline_options);
    map.addLayer(gt_polyline);
    map.addLayer(meas_polyline);
});

async function getData(tag) {
    let gt = [];
    let meas = [];

    if (tag != null || tag != '') {
        let r1 = await fetch(`./data/${tag}/gt/${tag}.json`);
        let r2 = await fetch(`./data/${tag}/meas/${tag}.json`);
    
        if (r1.ok && r2.ok) {
            gt = await r1.json();
            meas = await r2.json();
        } else {
            alert("HTTP-Error: " + response.status);
        }

        return [gt[0], meas];
    }
}