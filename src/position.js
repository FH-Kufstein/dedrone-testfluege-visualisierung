module.exports = class Position {

    constructor(droneName, ts, lon, lat, alt) {
      this.droneName = droneName;
      this.ts = ts;
      this.lon = lon;
      this.lat = lat;
      this.alt = alt;
    }
  }