import { UseCaseError } from '@/core/errors/use-cases-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(`Resource with id: "${identifier}", not found`)
  }
}
