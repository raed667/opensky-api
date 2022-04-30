# OpenSky

Lightweight wrapper for OpenSky’s REST API. The API lets you retrieve live airspace information for research and non-commerical purposes. Please refer to [OpenSky Network API documentation](https://openskynetwork.github.io/opensky-api/index.html).

This project is not affiliated to [OpenSky Network](https://github.com/openskynetwork), but the codebase is heavily inspired by the [opensky-api](https://github.com/openskynetwork/opensky-api) Java implementation.

## Installation

```
yarn add opensky-api
```

or

```
npm install opensky-api --save
```

## Basic usage

The following example is equivalent to calling the REST API with this endpoint `https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444`

```ts
import { OpenSkyApi } from 'opensky-api';

const api = OpenSkyApi();

api
  .getStates(1458564121, ['3c6444'])
  .then((response) => console.log(response.states));
```

[CodeSandbox Frontend Example](https://codesandbox.io/s/stoic-keldysh-y0mj7o?file=/src/App.js) | [CodeSandbox NodeJs Example](https://codesandbox.io/s/billowing-glitter-l2nj36?file=/routes/index.js)

## Maintainers

This project is maintained by [Raed Chammam](https://raed.dev).

## License

GPL-3.0 License
