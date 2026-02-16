import { Injectable } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import {
  GeocodingService,
  GeocodeResult,
} from '@/domain/fastfeet/application/geolocation/geocoding-service'
import { NominatimResponse } from './dto/nominatim-response.dto'

interface NominatimApiParams {
  q: string
  format: 'json'
  countrycodes: string
  limit: number
  addressdetails: number
}

@Injectable()
export class NominatimGeocodingService implements GeocodingService {
  private readonly baseURL = 'https://nominatim.openstreetmap.org'
  private readonly userAgent = 'FastFeet-DeliveryApp/1.0'
  private readonly timeout = 5000

  async geocode(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await axios.get<NominatimResponse>(
        `${this.baseURL}/search`,
        {
          params: this.buildParams(address),
          headers: {
            'User-Agent': this.userAgent,
          },
          timeout: this.timeout,
        },
      )

      return this.parseResponse(response.data, address)
    } catch (error) {
      this.handleError(error, address)
      return null
    }
  }

  private buildParams(address: string): NominatimApiParams {
    return {
      q: address,
      format: 'json',
      countrycodes: 'br',
      limit: 1,
      addressdetails: 1,
    }
  }

  private parseResponse(
    data: NominatimResponse,
    address: string,
  ): GeocodeResult | null {
    if (!data || data.length === 0) {
      console.warn(`[Geocoding] No results found for address: ${address}`)
      return null
    }

    const result = data[0]

    if (!result.lat || !result.lon) {
      console.warn(
        `[Geocoding] Invalid coordinates in response for: ${address}`,
      )
      return null
    }

    const latitude = parseFloat(result.lat)
    const longitude = parseFloat(result.lon)

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn(`[Geocoding] Could not parse coordinates for: ${address}`)
      return null
    }

    return {
      latitude,
      longitude,
      formattedAddress: result.display_name,
    }
  }

  private handleError(error: unknown, address: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        console.error(
          `[Geocoding] API error (${axiosError.response.status}): ${axiosError.message} - Address: ${address}`,
        )
      } else if (axiosError.request) {
        console.error(`[Geocoding] No response from API - Address: ${address}`)
      } else {
        console.error(
          `[Geocoding] Request setup error: ${axiosError.message} - Address: ${address}`,
        )
      }
    } else if (error instanceof Error) {
      console.error(
        `[Geocoding] Unexpected error: ${error.message} - Address: ${address}`,
      )
    } else {
      console.error(`[Geocoding] Unknown error - Address: ${address}`)
    }
  }
}
