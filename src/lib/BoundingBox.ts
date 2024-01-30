export class BoundingBox {
  minLatitude: number;
  minLongitude: number;
  maxLatitude: number;
  maxLongitude: number;

  constructor(
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
  ) {
    this.checkLatitude(minLatitude);
    this.checkLatitude(maxLatitude);
    this.checkLongitude(minLongitude);
    this.checkLongitude(maxLongitude);

    this.minLatitude = minLatitude;
    this.minLongitude = minLongitude;
    this.maxLatitude = maxLatitude;
    this.maxLongitude = maxLongitude;
  }

  private checkLatitude(lat: number) {
    if (lat < -90 || lat > 90)
      throw new Error(`Illegal latitude ${lat}. Must be within [-90, 90]`);
  }

  private checkLongitude(lon: number) {
    if (lon < -180 || lon > 180)
      throw new Error(`Illegal longitude ${lon}. Must be within [-180, 180]`);
  }
}
