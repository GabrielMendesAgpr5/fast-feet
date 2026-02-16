// src/infra/database/prisma/repositories/prisma-notifications-repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { INotificationsRepository } from '@/domain/fastfeet/application/repositories/notifications-repository'
import { Notification } from '@/domain/fastfeet/enterprise/entities/notification'

@Injectable()
export class PrismaNotificationsRepository implements INotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        title: notification.title,
        content: notification.content,
        recipientId: notification.recipientId,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      },
    })
  }
}
