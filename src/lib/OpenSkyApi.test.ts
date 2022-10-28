import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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
                stats: [],
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
    });
  });
});
