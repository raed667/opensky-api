import { BoundingBox } from './BoundingBox';

describe('BoundingBox', () => {
  it.each([{ lat: 91 }, { lat: 100 }, { lat: -91 }, { lat: -100 }])(
    'should check invalid min-latitude $lat',
    ({ lat }) => {
      expect(() => {
        new BoundingBox(lat, 0, 0, 0);
      }).toThrowError(`Illegal latitude ${lat}. Must be within [-90, 90]`);
    },
  );

  it.each([{ lat: 91 }, { lat: 100 }, { lat: -91 }, { lat: -100 }])(
    'should check invalid max-latitude $lat',
    ({ lat }) => {
      expect(() => {
        new BoundingBox(0, lat, 0, 0);
      }).toThrowError(`Illegal latitude ${lat}. Must be within [-90, 90]`);
    },
  );

  it.each([{ lon: 181 }, { lon: 280 }, { lon: -181 }, { lon: -280 }])(
    'should check invalid min-longitude $lon',
    ({ lon }) => {
      expect(() => {
        new BoundingBox(0, 0, lon, 0);
      }).toThrowError(`Illegal longitude ${lon}. Must be within [-180, 180]`);
    },
  );

  it.each([{ lon: 181 }, { lon: 280 }, { lon: -181 }, { lon: -280 }])(
    'should check invalid max-longitude $lon',
    ({ lon }) => {
      expect(() => {
        new BoundingBox(0, 0, 0, lon);
      }).toThrowError(`Illegal longitude ${lon}. Must be within [-180, 180]`);
    },
  );

  it('should call constructor', () => {
    const bb = new BoundingBox(-90, 90, -180, 180);

    expect(bb.minLatitude).toEqual(-90);
    expect(bb.maxLatitude).toEqual(90);
    expect(bb.minLongitude).toEqual(-180);
    expect(bb.maxLongitude).toEqual(180);
  });
});
