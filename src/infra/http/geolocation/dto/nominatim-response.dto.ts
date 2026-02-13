export interface NominatimResult {
  lat: string
  lon: string
  display_name: string
  address?: {
    road?: string
    house_number?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export type NominatimResponse = NominatimResult[]
