import { BoundingBox, OpenSkyApi } from '.';

describe('opensky-api', () => {
  describe('unauthenticated', () => {
    describe('getStates', () => {
      const api = new OpenSkyApi();

      it('query time and aircraft', async () => {
        const result = await api.getStates(1458564121, ['3c6444']);
        expect(result).toMatchInlineSnapshot(`
          {
            "states": [
              {
                "baroAltitude": 9639.3,
                "callsign": "DLH9LF",
                "geoAltitude": 9547.86,
                "heading": 98.26,
                "icao24": "3c6444",
                "lastContact": 1458564120,
                "lastPositionUpdate": 1458564120,
                "latitude": 50.1964,
                "longitude": 6.1546,
                "onGround": false,
                "originCountry": "Germany",
                "positionSource": 0,
                "serials": null,
                "spi": false,
                "squawk": "1000",
                "velocity": 232.88,
                "verticalRate": 4.55,
              },
            ],
            "time": 1458564121,
          }
        `);
      });

      it('query box covering Switzerland', async () => {
        const result = await api.getStates(
          null,
          [],
          new BoundingBox(45.8389, 47.8229, 5.9962, 10.5226)
        );
        expect(result?.states.length).not.toEqual(0);
      });
    });
  });
});
