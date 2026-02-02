import { UseCaseError } from '@/core/errors/use-cases-error'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Unauthorized')
  }
}
