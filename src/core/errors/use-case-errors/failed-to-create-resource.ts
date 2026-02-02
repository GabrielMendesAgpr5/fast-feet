import { UseCaseError } from '@/core/errors/use-cases-error'

export class FailedToCreateResourceError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(`Failed to create resource: "${identifier}"`)
  }
}
