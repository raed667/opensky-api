import { StateVector } from '../types/StateVector';

export const stateVectorMapper = (raw: any[]): StateVector => {
  if (!raw || !Array.isArray(raw)) {
    throw new Error('StateVectorMapper requires input array');
  }

  return {
    icao24: raw[0],
    callsign: raw[1]?.trim(),
    originCountry: raw[2],
    lastPositionUpdate: raw[3],
    lastContact: raw[4],
    longitude: raw[5],
    latitude: raw[6],
    baroAltitude: raw[7],
    onGround: raw[8],
    velocity: raw[9],
    heading: raw[10],
    verticalRate: raw[11],
    serials: raw[12],
    geoAltitude: raw[13],
    squawk: raw[14],
    spi: raw[15],
    positionSource: raw[16],
  };
};
