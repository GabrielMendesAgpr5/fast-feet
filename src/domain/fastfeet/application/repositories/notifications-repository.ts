import { Notification } from '../../enterprise/entities/notification'

export abstract class INotificationsRepository {
  abstract create(notification: Notification): Promise<void>
}
