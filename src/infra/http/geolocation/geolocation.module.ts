import { Module } from '@nestjs/common'
import { NominatimGeocodingService } from './nominatim-geocoding.service'
import { GeocodingService } from '@/domain/fastfeet/application/geolocation/geocoding-service'

@Module({
  providers: [
    {
      provide: GeocodingService,
      useClass: NominatimGeocodingService,
    },
  ],
  exports: [GeocodingService],
})
export class GeolocationModule {}
