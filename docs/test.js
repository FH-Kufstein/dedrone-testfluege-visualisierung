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

// drawLayers();
getData('t3')
.then((res) => {
    console.log(res.statusText);
});

function drawLayers() {
    const layers = [];
    
    for (let i = 1; i < 10; i++) {
        layers.push(generateLayers(`t${i}`)) ;
    }

    console.log(layers);
}

function generateLayers(test_tag) {
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
                opacity: 0.75,
                weight: 1,
                lineCap: 'round'
            }
        }
    }
    const gpx1 = `./data/${test_tag}/anafi.gpx`; // URL to your GPX file or the GPX itself
    const gpx2 = `./data/${test_tag}/br.gpx`;
    const gpx3 = `./data/${test_tag}/dedrone_log.gpx`;


    const layer1 = new L.GPX(gpx1, gpx_options('blue'))
    .on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    });

    const layer2 = new L.GPX(gpx2, gpx_options('red'))
    .on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    });

    const layer3 = new L.GPX(gpx3, gpx_options('red'))
    .on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    });
    
    /*.on('loaded', function(e) {
    //   map.fitBounds(e.target.getBounds());
        console.log(e.target);
    }).addTo(map);*/

    return [layer1, layer2, layer3];
}

async function getData(test_tag) {
    // let anafi = [];
    // let br = [];

    // if (tag != null || tag != '') {
    //     let r1 = await fetch(`./data/${test_tag}/anafi.gpx`);
    //     let r2 = await fetch(`./data/${test_tag}/br.gpx`);
    
    //     if (r1.ok) anafi = await r1.json();
    //     if (r2.ok) br = await r2.json();
    // }

    // return [anafi, br];
    return await fetch(`./data/${test_tag}`);
}