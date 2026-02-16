import { diskStorage } from 'multer'
import { Request } from 'express'
import { extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export const multerConfig = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const uploadPath = './uploads/deliveries'

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true })
      }

      cb(null, uploadPath)
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueId = new UniqueEntityId()
      const uniqueName = `${uniqueId.toString()}${extname(file.originalname)}`
      cb(null, uniqueName)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg']

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed'), false)
    }
  },
}
