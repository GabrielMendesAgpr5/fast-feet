import { UseCaseError } from '@/core/errors/use-cases-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Not allowed')
  }
}
