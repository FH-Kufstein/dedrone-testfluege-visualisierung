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

getData('t3')
.then(data => {
    const latlngs = data.map((pos) => {
        return [pos.lat, pos.lon];
    });
    const polylineOptions = {
        color: 'blue',
        weight: 2
    };
    const polyline = new L.Polyline(latlngs, polylineOptions);
    map.addLayer(polyline);
});

async function getData(tag) {
    let data = [];
    if (tag != null || tag != '') {
        let r1 = await fetch(`./data/${tag}/gt/${tag}.json`);
        // let r2 = await fetch(`http://localhost:8000/${tag}/meas/${tag}.json`);
    
        // if (r1.ok && r2.ok) {
        if (r1.ok) {
            // gt = await r1.json();
            // meas = await r2.json();
            data = await r1.json();
        } else {
            alert("HTTP-Error: " + response.status);
        }

        return data[0];
    }
}