import { Injectable } from '@nestjs/common'
import { Order, OrderStatusEnum } from '../../enterprise/entities/order'
import { INotificationsRepository } from '../../application/repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'

@Injectable()
export class NotificationService {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async sendOrderStatusNotification(
    order: Order,
    previousStatus: OrderStatusEnum,
    newStatus: OrderStatusEnum,
  ): Promise<void> {
    const title = this.getNotificationTitle(newStatus)
    const content = this.getNotificationMessage(
      order,
      previousStatus,
      newStatus,
    )

    const notification = Notification.create({
      recipientId: order.recipientId,
      title,
      content,
      id: '',
    })

    await this.notificationsRepository.create(notification)
  }

  private getNotificationTitle(status: OrderStatusEnum): string {
    const titles: Record<OrderStatusEnum, string> = {
      [OrderStatusEnum.WAITING]: 'Pedido Aguardando',
      [OrderStatusEnum.PENDING]: 'Pedido com Retirada pendente',
      [OrderStatusEnum.WITHDRAWN]: 'Pedido Saiu para Entrega',
      [OrderStatusEnum.DELIVERED]: 'Pedido Entregue',
      [OrderStatusEnum.RETURNED]: 'Pedido Devolvido',
    }

    return titles[status] || 'Status do Pedido Atualizado'
  }

  private getNotificationMessage(
    order: Order,
    previousStatus: OrderStatusEnum,
    newStatus: OrderStatusEnum,
  ): string {
    const messages: Record<OrderStatusEnum, string> = {
      [OrderStatusEnum.WAITING]: `Seu pedido foi recebido e está sendo aguardando processamento.`,
      [OrderStatusEnum.PENDING]: `Seu pedido está pronto e pendente para retirada pelo entregador.`,
      [OrderStatusEnum.WITHDRAWN]: `Seu pedido está a caminho! O entregador já retirou o pacote.`,
      [OrderStatusEnum.DELIVERED]: `Seu pedido foi entregue com sucesso!`,
      [OrderStatusEnum.RETURNED]: `Seu pedido foi devolvido.`,
    }

    return (
      messages[newStatus] ||
      `O status do seu pedido mudou de ${previousStatus} para ${newStatus}.`
    )
  }
}
