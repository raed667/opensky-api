import { stateVectorMapper } from './StateVectorMapper';

describe('State Vector Mapper', () => {
  it.each([
    { raw: null },
    { raw: undefined },
    { raw: {} },
    { raw: { a: 'b' } },
    { raw: 1 },
    { raw: 'string' },
  ])('should throw error if raw data is not array: ($raw)', ({ raw }) => {
    // @ts-expect-error this is for testing
    expect(() => stateVectorMapper(raw)).toThrow(
      'StateVectorMapper requires input array',
    );
  });

  it('should map an empty state vector', () => {
    expect(stateVectorMapper([])).toEqual({
      baroAltitude: undefined,
      callsign: undefined,
      geoAltitude: undefined,
      heading: undefined,
      icao24: undefined,
      lastContact: undefined,
      lastPositionUpdate: undefined,
      latitude: undefined,
      longitude: undefined,
      onGround: undefined,
      originCountry: undefined,
      positionSource: undefined,
      serials: undefined,
      spi: undefined,
      squawk: undefined,
      velocity: undefined,
      verticalRate: undefined,
    });
  });

  it('should map a state vector', () => {
    expect(
      stateVectorMapper([
        'icao24',
        'callsign',
        'originCountry',
        'lastPositionUpdate',
        'lastContact',
        'longitude',
        'latitude',
        'baroAltitude',
        'onGround',
        'velocity',
        'heading',
        'verticalRate',
        'serials',
        'geoAltitude',
        'squawk',
        'spi',
        'positionSource',
      ]),
    ).toEqual({
      icao24: 'icao24',
      callsign: 'callsign',
      originCountry: 'originCountry',
      lastPositionUpdate: 'lastPositionUpdate',
      lastContact: 'lastContact',
      longitude: 'longitude',
      latitude: 'latitude',
      baroAltitude: 'baroAltitude',
      onGround: 'onGround',
      velocity: 'velocity',
      heading: 'heading',
      verticalRate: 'verticalRate',
      serials: 'serials',
      geoAltitude: 'geoAltitude',
      squawk: 'squawk',
      spi: 'spi',
      positionSource: 'positionSource',
    });
  });

  it('should trim the callsign', () => {
    expect(stateVectorMapper(['icao24', '    callsign    ']).callsign).toEqual(
      'callsign',
    );
  });

  it('should skip the callsign trimming', () => {
    expect(stateVectorMapper(['icao24', null]).callsign).toEqual(undefined);

    expect(stateVectorMapper(['icao24', undefined]).callsign).toEqual(
      undefined,
    );
  });
});
