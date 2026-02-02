import { UseCaseError } from '../use-cases-error'

export class ConflictError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Conflict')
  }
}
