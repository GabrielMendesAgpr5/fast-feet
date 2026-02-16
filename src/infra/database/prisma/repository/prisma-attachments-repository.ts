import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { IAttachmentsRepository } from '@/domain/fastfeet/application/repositories/attachments-repository'
import { Attachment } from '@/domain/fastfeet/enterprise/entities/attachment'

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: {
        id: attachment.id.toString(),
        title: attachment.title,
        url: attachment.url,
        createdAt: attachment.createdAt,
        updatedAt: attachment.updatedAt,
      },
    })
  }
}
