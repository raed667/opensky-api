import { BoundingBox } from './BoundingBox';

describe('BoundingBox', () => {
  it.each([{ lat: 91 }, { lat: 100 }, { lat: -91 }, { lat: -100 }])(
    'should check invalid min-latitude $lat',
    ({ lat }) => {
      expect(() => {
        new BoundingBox({
          minLatitude: lat,
          maxLatitude: 0,
          minLongitude: 0,
          maxLongitude: 0,
        });
      }).toThrowError(`Illegal latitude ${lat}. Must be within [-90, 90]`);
    }
  );

  it.each([{ lat: 91 }, { lat: 100 }, { lat: -91 }, { lat: -100 }])(
    'should check invalid max-latitude $lat',
    ({ lat }) => {
      expect(() => {
        new BoundingBox({
          minLatitude: 0,
          maxLatitude: lat,
          minLongitude: 0,
          maxLongitude: 0,
        });
      }).toThrowError(`Illegal latitude ${lat}. Must be within [-90, 90]`);
    }
  );

  it.each([{ lon: 181 }, { lon: 280 }, { lon: -181 }, { lon: -280 }])(
    'should check invalid min-longitude $lon',
    ({ lon }) => {
      expect(() => {
        new BoundingBox({
          minLatitude: 0,
          maxLatitude: 0,
          minLongitude: lon,
          maxLongitude: 0,
        });
      }).toThrowError(`Illegal longitude ${lon}. Must be within [-180, 180]`);
    }
  );

  it.each([{ lon: 181 }, { lon: 280 }, { lon: -181 }, { lon: -280 }])(
    'should check invalid max-longitude $lon',
    ({ lon }) => {
      expect(() => {
        new BoundingBox({
          minLatitude: 0,
          maxLatitude: 0,
          minLongitude: 0,
          maxLongitude: lon,
        });
      }).toThrowError(`Illegal longitude ${lon}. Must be within [-180, 180]`);
    }
  );

  it('should call constructor', () => {
    const bb = new BoundingBox({
      minLatitude: -90,
      maxLatitude: 90,
      minLongitude: -180,
      maxLongitude: 180,
    });

    expect(bb.minLatitude).toEqual(-90);
    expect(bb.maxLatitude).toEqual(90);
    expect(bb.minLongitude).toEqual(-180);
    expect(bb.maxLongitude).toEqual(180);
  });
});
