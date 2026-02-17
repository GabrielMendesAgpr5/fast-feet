import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class GetNearbyOrdersQueryDTO {
  @ApiProperty({
    description: 'Latitude of deliveryman current location',
    example: -28.6773,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number

  @ApiProperty({
    description: 'Longitude of deliveryman current location',
    example: -49.3698,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number

  @ApiPropertyOptional({
    description: 'Maximum distance in kilometers',
    example: 10,
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  maxDistance?: number
}
