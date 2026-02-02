import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url({ message: 'Invalid DATABASE_URL' }),
})

export type Env = z.infer<typeof envSchema>
