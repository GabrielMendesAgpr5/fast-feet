import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

const tokenPayloadSchema = z.object({
  sub: z.string(),
  role: z.nativeEnum(UserRoleEnum),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(env.get('JWT_PUBLIC_KEY'), 'base64'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: unknown) {
    return tokenPayloadSchema.parse(payload)
  }
}
