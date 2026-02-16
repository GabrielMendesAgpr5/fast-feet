import { ValueObject } from '@/core/entities/value-object'

interface CoordinatesProps {
  latitude: number
  longitude: number
}

export class Coordinates extends ValueObject<CoordinatesProps> {
  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  // Valida se as coordenadas são válidas
  private static isValidLatitude(latitude: number): boolean {
    return latitude >= -90 && latitude <= 90
  }

  private static isValidLongitude(longitude: number): boolean {
    return longitude >= -180 && longitude <= 180
  }

  static create(latitude: number, longitude: number) {
    if (!this.isValidLatitude(latitude)) {
      throw new Error(
        `Invalid latitude: ${latitude}. Must be between -90 and 90`,
      )
    }

    if (!this.isValidLongitude(longitude)) {
      throw new Error(
        `Invalid longitude: ${longitude}. Must be between -180 and 180`,
      )
    }

    return new Coordinates({ latitude, longitude })
  }

  distanceTo(other: Coordinates): number {
    const R = 6371
    const dLat = this.toRad(other.latitude - this.latitude)
    const dLon = this.toRad(other.longitude - this.longitude)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(this.latitude)) *
        Math.cos(this.toRad(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  toString(): string {
    return `${this.latitude}, ${this.longitude}`
  }

  isWithinRadius(other: Coordinates, radiusInKm: number): boolean {
    return this.distanceTo(other) <= radiusInKm
  }
}
