export interface GeocodeResult {
  latitude: number
  longitude: number
  formattedAddress: string
}

export abstract class GeocodingService {
  abstract geocode(address: string): Promise<GeocodeResult | null>
}
