import { UseCaseError } from '@/core/errors/use-cases-error'

export class NotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Not found')
  }
}
