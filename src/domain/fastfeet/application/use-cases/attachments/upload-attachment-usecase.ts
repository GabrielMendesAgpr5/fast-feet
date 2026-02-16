import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { IAttachmentsRepository } from '../../repositories/attachments-repository'
import { Attachment } from '@/domain/fastfeet/enterprise/entities/attachment'

export interface IUploadAttachmentDTO {
  filename: string
  filepath: string
  title?: string
}

type UploadAttachmentResponseUseCase = Either<
  null,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(private attachmentsRepository: IAttachmentsRepository) {}

  async execute(
    data: IUploadAttachmentDTO,
  ): Promise<UploadAttachmentResponseUseCase> {
    const attachment = Attachment.create({
      title: data.title || data.filename,
      url: data.filepath,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
