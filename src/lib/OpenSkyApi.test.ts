import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { BoundingBox } from './BoundingBox';
import { OpenSkyApi } from './OpenSkyApi';

const axiosMock = new MockAdapter(axios);

describe('OpenSkyApi', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('authenticated', () => {
    const credentials = {
      username: 'username',
      password: 'password',
    };

    describe('getMyStates', () => {
      it('should set auth config', async () => {
        axiosMock
          .onGet('https://opensky-network.org/api/states/own')
          .reply(() => {
            return [
              200,
              {
                time: 123456789,
                states: [],
              },
            ];
          });

        const api = new OpenSkyApi(credentials);
        const result = await api.getMyStates(123456789, [], []);

        expect(result).toEqual({ time: 123456789, states: [] });

        const auth = axiosMock.history.get[0].auth;
        expect(auth).toEqual(credentials);

        // @ts-expect-error mock type is wrong
        const ua = axiosMock.history.get[0].headers['User-Agent'];
        expect(ua).toEqual('OpenSkyApi-TS/1.0');
      });

      it('should send with params', async () => {
        const icao24 = ['1111', '2222', '3333'];
        const serials = [4444, 5555];

        axiosMock
          .onGet('https://opensky-network.org/api/states/own')
          .reply(() => {
            return [
              200,
              {
                time: 123456789,
                states: [['123456789', '1111', '2222', '3333', '4444', '5555']],
              },
            ];
          });

        const api = new OpenSkyApi(credentials);
        const result = await api.getMyStates(123456789, icao24, serials);

        expect(result).toEqual({
          time: 123456789,
          states: [
            {
              baroAltitude: undefined,
              callsign: '1111',
              geoAltitude: undefined,
              heading: undefined,
              icao24: '123456789',
              lastContact: '4444',
              lastPositionUpdate: '3333',
              latitude: undefined,
              longitude: '5555',
              onGround: undefined,
              originCountry: '2222',
              positionSource: undefined,
              serials: undefined,
              spi: undefined,
              squawk: undefined,
              velocity: undefined,
              verticalRate: undefined,
            },
          ],
        });
      });
    });
  });

  describe('unauthenticated', () => {
    describe('getStates', () => {
      it('should send with params', async () => {
        const icao24 = ['1111', '2222', '3333'];

        axiosMock
          .onGet('https://opensky-network.org/api/states/all')
          .reply(() => {
            return [
              200,
              {
                time: 123456789,
                states: [['123456789', '1111', '2222', '3333', '4444', '5555']],
              },
            ];
          });

        const api = new OpenSkyApi();
        const bb = new BoundingBox(-90, 90, -180, 180);
        const result = await api.getStates(123456789, icao24, bb);

        expect(result).toEqual({
          time: 123456789,
          states: [
            {
              baroAltitude: undefined,
              callsign: '1111',
              geoAltitude: undefined,
              heading: undefined,
              icao24: '123456789',
              lastContact: '4444',
              lastPositionUpdate: '3333',
              latitude: undefined,
              longitude: '5555',
              onGround: undefined,
              originCountry: '2222',
              positionSource: undefined,
              serials: undefined,
              spi: undefined,
              squawk: undefined,
              velocity: undefined,
              verticalRate: undefined,
            },
          ],
        });
      });
    });

    describe('getMyStates', () => {
      it('should throw error', async () => {
        const api = new OpenSkyApi();

        await expect(async () => {
          await api.getMyStates(123456789, [], []);
        }).rejects.toThrowError("Anonymous access of 'myStates' not allowed");
      });
    });

    describe('getFlights', () => {
      it('404 should return empty array', async () => {
        axiosMock
          .onGet(
            'https://opensky-network.org/api/flights/all?begin=1517227200&end=1517230800'
          )
          .reply(() => {
            return [
              404,
              [
                {
                  icao24: 'c078fd',
                  firstSeen: 1517227317,
                  estDepartureAirport: 'CYYZ',
                  lastSeen: 1517230676,
                  estArrivalAirport: 'CYUL',
                  callsign: 'SWG9426 ',
                  estDepartureAirportHorizDistance: 525,
                  estDepartureAirportVertDistance: 104,
                  estArrivalAirportHorizDistance: 3244,
                  estArrivalAirportVertDistance: 81,
                  departureAirportCandidatesCount: 1,
                  arrivalAirportCandidatesCount: 1,
                },
                {
                  icao24: '8686b2',
                  firstSeen: 1517229296,
                  estDepartureAirport: null,
                  lastSeen: 1517230536,
                  estArrivalAirport: 'RJTK',
                  callsign: 'JAL920  ',
                  estDepartureAirportHorizDistance: null,
                  estDepartureAirportVertDistance: null,
                  estArrivalAirportHorizDistance: 15167,
                  estArrivalAirportVertDistance: 1421,
                  departureAirportCandidatesCount: 0,
                  arrivalAirportCandidatesCount: 1,
                },
              ],
            ];
          });

        const api = new OpenSkyApi();
        const result = await api.getFlights(1517227200, 1517230800);

        expect(result).toEqual([]);
      });

      it('should return flights', async () => {
        axiosMock
          .onGet('https://opensky-network.org/api/flights/all')
          .reply(() => {
            return [
              200,
              [
                {
                  icao24: 'c078fd',
                  firstSeen: 1517227317,
                  estDepartureAirport: 'CYYZ',
                  lastSeen: 1517230676,
                  estArrivalAirport: 'CYUL',
                  callsign: '  SWG9426 ',
                  estDepartureAirportHorizDistance: 525,
                  estDepartureAirportVertDistance: 104,
                  estArrivalAirportHorizDistance: 3244,
                  estArrivalAirportVertDistance: 81,
                  departureAirportCandidatesCount: 1,
                  arrivalAirportCandidatesCount: 1,
                },
                {
                  icao24: '8686b2',
                  firstSeen: 1517229296,
                  estDepartureAirport: null,
                  lastSeen: 1517230536,
                  estArrivalAirport: 'RJTK',
                  callsign: 'JAL920  ',
                  estDepartureAirportHorizDistance: null,
                  estDepartureAirportVertDistance: null,
                  estArrivalAirportHorizDistance: 15167,
                  estArrivalAirportVertDistance: 1421,
                  departureAirportCandidatesCount: 0,
                  arrivalAirportCandidatesCount: 1,
                },
              ],
            ];
          });

        const api = new OpenSkyApi();
        const result = await api.getFlights(1517227200, 1517230800);

        expect(result).toEqual([
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'SWG9426',
            departureAirportCandidatesCount: 1,
            estArrivalAirport: 'CYUL',
            estArrivalAirportHorizDistance: 3244,
            estArrivalAirportVertDistance: 81,
            estDepartureAirport: 'CYYZ',
            estDepartureAirportHorizDistance: 525,
            estDepartureAirportVertDistance: 104,
            firstSeen: 1517227317,
            icao24: 'c078fd',
            lastSeen: 1517230676,
          },
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'JAL920',
            departureAirportCandidatesCount: 0,
            estArrivalAirport: 'RJTK',
            estArrivalAirportHorizDistance: 15167,
            estArrivalAirportVertDistance: 1421,
            estDepartureAirport: null,
            estDepartureAirportHorizDistance: null,
            estDepartureAirportVertDistance: null,
            firstSeen: 1517229296,
            icao24: '8686b2',
            lastSeen: 1517230536,
          },
        ]);
      });
    });

    describe('getFlightsByArrivalAirport', () => {
      it('should return flights', async () => {
        axiosMock
          .onGet('https://opensky-network.org/api/flights/arrival')
          .reply(() => {
            return [
              200,
              [
                {
                  icao24: 'c078fd',
                  firstSeen: 1517227317,
                  estDepartureAirport: 'CYYZ',
                  lastSeen: 1517230676,
                  estArrivalAirport: 'CYUL',
                  callsign: '  SWG9426 ',
                  estDepartureAirportHorizDistance: 525,
                  estDepartureAirportVertDistance: 104,
                  estArrivalAirportHorizDistance: 3244,
                  estArrivalAirportVertDistance: 81,
                  departureAirportCandidatesCount: 1,
                  arrivalAirportCandidatesCount: 1,
                },
                {
                  icao24: '8686b2',
                  firstSeen: 1517229296,
                  estDepartureAirport: null,
                  lastSeen: 1517230536,
                  estArrivalAirport: 'RJTK',
                  callsign: 'JAL920  ',
                  estDepartureAirportHorizDistance: null,
                  estDepartureAirportVertDistance: null,
                  estArrivalAirportHorizDistance: 15167,
                  estArrivalAirportVertDistance: 1421,
                  departureAirportCandidatesCount: 0,
                  arrivalAirportCandidatesCount: 1,
                },
              ],
            ];
          });

        const api = new OpenSkyApi();
        const result = await api.getFlightsByArrivalAirport(
          'ABCD',
          1517227200,
          1517230800
        );

        expect(result).toEqual([
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'SWG9426',
            departureAirportCandidatesCount: 1,
            estArrivalAirport: 'CYUL',
            estArrivalAirportHorizDistance: 3244,
            estArrivalAirportVertDistance: 81,
            estDepartureAirport: 'CYYZ',
            estDepartureAirportHorizDistance: 525,
            estDepartureAirportVertDistance: 104,
            firstSeen: 1517227317,
            icao24: 'c078fd',
            lastSeen: 1517230676,
          },
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'JAL920',
            departureAirportCandidatesCount: 0,
            estArrivalAirport: 'RJTK',
            estArrivalAirportHorizDistance: 15167,
            estArrivalAirportVertDistance: 1421,
            estDepartureAirport: null,
            estDepartureAirportHorizDistance: null,
            estDepartureAirportVertDistance: null,
            firstSeen: 1517229296,
            icao24: '8686b2',
            lastSeen: 1517230536,
          },
        ]);
      });
    });

    describe('getFlightsByDepartureAirport', () => {
      it('should return flights', async () => {
        axiosMock
          .onGet('https://opensky-network.org/api/flights/departure')
          .reply(() => {
            return [
              200,
              [
                {
                  icao24: 'c078fd',
                  firstSeen: 1517227317,
                  estDepartureAirport: 'CYYZ',
                  lastSeen: 1517230676,
                  estArrivalAirport: 'CYUL',
                  callsign: '  SWG9426 ',
                  estDepartureAirportHorizDistance: 525,
                  estDepartureAirportVertDistance: 104,
                  estArrivalAirportHorizDistance: 3244,
                  estArrivalAirportVertDistance: 81,
                  departureAirportCandidatesCount: 1,
                  arrivalAirportCandidatesCount: 1,
                },
                {
                  icao24: '8686b2',
                  firstSeen: 1517229296,
                  estDepartureAirport: null,
                  lastSeen: 1517230536,
                  estArrivalAirport: 'RJTK',
                  callsign: 'JAL920  ',
                  estDepartureAirportHorizDistance: null,
                  estDepartureAirportVertDistance: null,
                  estArrivalAirportHorizDistance: 15167,
                  estArrivalAirportVertDistance: 1421,
                  departureAirportCandidatesCount: 0,
                  arrivalAirportCandidatesCount: 1,
                },
              ],
            ];
          });

        const api = new OpenSkyApi();
        const result = await api.getFlightsByDepartureAirport(
          'ABCD',
          1517227200,
          1517230800
        );

        expect(result).toEqual([
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'SWG9426',
            departureAirportCandidatesCount: 1,
            estArrivalAirport: 'CYUL',
            estArrivalAirportHorizDistance: 3244,
            estArrivalAirportVertDistance: 81,
            estDepartureAirport: 'CYYZ',
            estDepartureAirportHorizDistance: 525,
            estDepartureAirportVertDistance: 104,
            firstSeen: 1517227317,
            icao24: 'c078fd',
            lastSeen: 1517230676,
          },
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'JAL920',
            departureAirportCandidatesCount: 0,
            estArrivalAirport: 'RJTK',
            estArrivalAirportHorizDistance: 15167,
            estArrivalAirportVertDistance: 1421,
            estDepartureAirport: null,
            estDepartureAirportHorizDistance: null,
            estDepartureAirportVertDistance: null,
            firstSeen: 1517229296,
            icao24: '8686b2',
            lastSeen: 1517230536,
          },
        ]);
      });
    });

    describe('getFlightsByAircraft', () => {
      it('should return flights', async () => {
        axiosMock
          .onGet('https://opensky-network.org/api/flights/aircraft')
          .reply(() => {
            return [
              200,
              [
                {
                  icao24: 'c078fd',
                  firstSeen: 1517227317,
                  estDepartureAirport: 'CYYZ',
                  lastSeen: 1517230676,
                  estArrivalAirport: 'CYUL',
                  callsign: '  SWG9426 ',
                  estDepartureAirportHorizDistance: 525,
                  estDepartureAirportVertDistance: 104,
                  estArrivalAirportHorizDistance: 3244,
                  estArrivalAirportVertDistance: 81,
                  departureAirportCandidatesCount: 1,
                  arrivalAirportCandidatesCount: 1,
                },
                {
                  icao24: '8686b2',
                  firstSeen: 1517229296,
                  estDepartureAirport: null,
                  lastSeen: 1517230536,
                  estArrivalAirport: 'RJTK',
                  callsign: 'JAL920  ',
                  estDepartureAirportHorizDistance: null,
                  estDepartureAirportVertDistance: null,
                  estArrivalAirportHorizDistance: 15167,
                  estArrivalAirportVertDistance: 1421,
                  departureAirportCandidatesCount: 0,
                  arrivalAirportCandidatesCount: 1,
                },
              ],
            ];
          });

        const api = new OpenSkyApi();
        const result = await api.getFlightsByAircraft(
          'ABCD',
          1517227200,
          1517230800
        );

        expect(result).toEqual([
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'SWG9426',
            departureAirportCandidatesCount: 1,
            estArrivalAirport: 'CYUL',
            estArrivalAirportHorizDistance: 3244,
            estArrivalAirportVertDistance: 81,
            estDepartureAirport: 'CYYZ',
            estDepartureAirportHorizDistance: 525,
            estDepartureAirportVertDistance: 104,
            firstSeen: 1517227317,
            icao24: 'c078fd',
            lastSeen: 1517230676,
          },
          {
            arrivalAirportCandidatesCount: 1,
            callsign: 'JAL920',
            departureAirportCandidatesCount: 0,
            estArrivalAirport: 'RJTK',
            estArrivalAirportHorizDistance: 15167,
            estArrivalAirportVertDistance: 1421,
            estDepartureAirport: null,
            estDepartureAirportHorizDistance: null,
            estDepartureAirportVertDistance: null,
            firstSeen: 1517229296,
            icao24: '8686b2',
            lastSeen: 1517230536,
          },
        ]);
      });
    });
  });
});
