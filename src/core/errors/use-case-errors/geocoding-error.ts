import { UseCaseError } from '@/core/errors/use-cases-error'

export class GeocodingFailedError extends Error implements UseCaseError {
  constructor(address?: string) {
    super(
      address
        ? `Failed to find coordinates for address: "${address}"`
        : 'Failed to find coordinates. Please provide latitude and longitude manually.',
    )
  }
}
