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
        const result = await api.getMyStates({
          time: 123456789,
          icao24: [],
          serials: [],
        });

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
        const result = await api.getMyStates({
          time: 123456789,
          icao24,
          serials,
        });

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
        const boundingBox = new BoundingBox({
          minLatitude: -90,
          maxLatitude: 90,
          minLongitude: -180,
          maxLongitude: 180,
        });
        const result = await api.getStates({
          time: 123456789,
          icao24,
          boundingBox,
        });

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
          await api.getMyStates({ time: 123456789, icao24: [], serials: [] });
        }).rejects.toThrowError("Anonymous access of 'myStates' not allowed");
      });
    });
  });
});
