export type PositionSource = 'ADS_B' | 'ASTERIX' | 'MLAT' | 'FLARM' | 'UNKNOWN'

export type StateVector = {
  geoAltitude: number
  longitude: number
  latitude: number
  velocity: number
  heading: number
  verticalRate: number
  icao24: string
  callsign: string
  onGround: boolean
  lastContact: number
  lastPositionUpdate: number
  originCountry: string
  squawk: string
  serials: number[]
  spi: boolean
  baroAltitude: number
  positionSource: PositionSource
}
