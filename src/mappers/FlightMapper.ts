import { Flight } from './../types/Flight';

export const flightMapper = (raw: any): Flight => {
  return {
    icao24: raw.icao24,
    firstSeen: raw.firstSeen,
    estDepartureAirport: raw.estDepartureAirport,
    lastSeen: raw.lastSeen,
    estArrivalAirport: raw.estArrivalAirport,
    callsign: raw.callsign?.trim(),
    estDepartureAirportHorizDistance: raw.estDepartureAirportHorizDistance,
    estDepartureAirportVertDistance: raw.estDepartureAirportVertDistance,
    estArrivalAirportHorizDistance: raw.estArrivalAirportHorizDistance,
    estArrivalAirportVertDistance: raw.estArrivalAirportVertDistance,
    departureAirportCandidatesCount: raw.departureAirportCandidatesCount,
    arrivalAirportCandidatesCount: raw.arrivalAirportCandidatesCount,
  };
};
