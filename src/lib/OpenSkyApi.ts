'use strict';

import axios, { Axios, AxiosRequestConfig } from 'axios';
import { URLSearchParams } from 'iso-url';

import { stateVectorMapper } from '../mappers/StateVectorMapper';
import { Credentials } from '../types/Credentials';

import { BoundingBox } from './BoundingBox';

type RequestType = 'GET_STATES' | 'GET_MY_STATES';

const axiosConfig: AxiosRequestConfig = {
  timeout: 5000,
  headers: { 'User-Agent': 'OpenSkyApi-TS/1.0' },
};

export class OpenSkyApi {
  private static HOST = 'opensky-network.org';
  private static API_ROOT = `https://${this.HOST}/api`;
  private static STATES_URI = `${this.API_ROOT}/states/all`;
  private static MY_STATES_URI = `${this.API_ROOT}/states/own`;

  private _axios: Axios;

  private authenticated = false;

  private lastRequestTime: Record<RequestType, number | null> = {
    GET_STATES: null,
    GET_MY_STATES: null,
  };

  constructor(credentials?: Credentials) {
    if (credentials?.username && credentials?.password) {
      axiosConfig.auth = {
        username: credentials?.username,
        password: credentials?.password,
      };
      this.authenticated = true;
    }

    this._axios = axios.create(axiosConfig);
  }

  public getStates({
    time,
    icao24,
    boundingBox,
  }: {
    time?: number | null;
    icao24?: string[] | null;
    boundingBox?: BoundingBox | null;
  }) {
    const nvps: Array<Record<string, string>> = [];

    if (time) {
      nvps.push({ time: String(time) });
    }

    icao24?.forEach((i) => {
      nvps.push({ icao24: i });
    });

    if (boundingBox) {
      nvps.push({ lamin: String(boundingBox.minLatitude) });
      nvps.push({ lamax: String(boundingBox.maxLatitude) });
      nvps.push({ lomin: String(boundingBox.minLongitude) });
      nvps.push({ lomax: String(boundingBox.maxLongitude) });
    }

    if (this.checkRateLimit('GET_STATES', 4900, 9900)) {
      return this.getOpenSkyStates(OpenSkyApi.STATES_URI, nvps);
    }
    return null;
  }

  public getMyStates({
    time,
    icao24,
    serials,
  }: {
    time?: number | null;
    icao24?: string[] | null;
    serials?: number[] | null;
  }) {
    if (!this.authenticated) {
      throw new Error("Anonymous access of 'myStates' not allowed");
    }

    const nvps: Array<Record<string, string>> = [];

    if (time) {
      nvps.push({ time: String(time) });
    }

    icao24?.forEach((i) => {
      nvps.push({ icao24: i });
    });

    serials?.forEach((s) => {
      nvps.push({ serials: String(s) });
    });

    if (this.checkRateLimit('GET_MY_STATES', 900, 0)) {
      return this.getOpenSkyStates(OpenSkyApi.MY_STATES_URI, nvps);
    }
    return null;
  }

  private async getOpenSkyStates(
    url: string,
    nvps: Array<Record<string, string>>
  ) {
    const params = new URLSearchParams();

    nvps.forEach((i) => {
      for (const [key, value] of Object.entries(i)) {
        params.append(key, value);
      }
    });

    const { data } = await this._axios.get<{ time: number; states: any[] }>(
      url,
      {
        params,
      }
    );

    const states = data?.states?.map((state) => stateVectorMapper(state)) || [];

    return {
      time: data.time,
      states,
    };
  }

  private checkRateLimit(
    type: RequestType,
    timeDiffAuth: number,
    timeDiffNoAuth: number
  ): boolean {
    const t = this.lastRequestTime[type];
    const now = Date.now();
    this.lastRequestTime[type] = now;

    return (
      t == null ||
      (this.authenticated && now - t > timeDiffAuth) ||
      (!this.authenticated && now - t > timeDiffNoAuth)
    );
  }
}

export { BoundingBox } from './BoundingBox';
