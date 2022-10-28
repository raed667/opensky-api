# OpenSky

[![Quality Check](https://github.com/raed667/opensky-api/actions/workflows/ci.yml/badge.svg)](https://github.com/raed667/opensky-api/actions/workflows/ci.yml)
![Stability: Stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)
![npm](https://img.shields.io/npm/v/opensky-api)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/opensky-api)
![npm downloads](https://img.shields.io/npm/dt/opensky-api)
![LICENSE](https://img.shields.io/npm/l/opensky-api)

Lightweight API wrapper for OpenSky’s REST API. The API lets you retrieve live airspace information for research and non-commercial purposes. Please refer to [OpenSky Network API documentation](https://openskynetwork.github.io/opensky-api/index.html).

This project is not affiliated to [OpenSky Network](https://github.com/openskynetwork), but the codebase is heavily inspired by the [opensky-api](https://github.com/openskynetwork/opensky-api) Java implementation.

## 📦 Install

```sh
yarn add opensky-api
# or
pnpm add opensky-api
# or
npm install opensky-api --save
```

## ⚡️ Quick start

The following example is equivalent to calling the REST API: `https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444`

```ts
import { OpenSkyApi } from 'opensky-api';

const api = OpenSkyApi();

api
  .getStates(1458564121, ['3c6444'])
  .then((response) => console.log(response.states));
```

[Frontend Example](https://codesandbox.io/s/stoic-keldysh-y0mj7o?file=/src/App.js) | [NodeJs Example](https://codesandbox.io/s/billowing-glitter-l2nj36?file=/routes/index.js)

## 📚 Documentation

- [OpenSkyJS](https://raed667.github.io/opensky-api/)
- [OpenSky REST](https://openskynetwork.github.io/opensky-api/rest.html)

## 👥 Contributors

This project is maintained by [Raed Chammam](https://raed.dev).

This project is considered stable but not in active development. If you encounter a problem, create an issue and I will respond with best effort.
## 📜 License

[GPL-3.0](LICENSE)
