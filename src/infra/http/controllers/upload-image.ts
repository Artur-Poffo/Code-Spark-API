import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { makeUploadImageUseCase } from '@/infra/use-cases/factories/make-upload-image-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { ImagePresenter } from '../presenters/image-presenter'
import { ImageMapper } from './../../database/prisma/mappers/image-mapper'

interface MulterRequest extends FastifyRequest {
  file?: {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
  }
}

export async function uploadImageController(request: MulterRequest, reply: FastifyReply) {
  if (!request.file) {
    return await reply.status(404).send({
      message: 'Image required'
    })
  }

  const uploadImageUseCase = makeUploadImageUseCase()

  const result = await uploadImageUseCase.exec({
    body: request.file.buffer,
    imageName: request.file.originalname,
    imageType: request.file.mimetype as 'image/jpeg' | 'image/png',
    size: request.file.size
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case InvalidMimeTypeError:
        return await reply.status(415).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const image = ImageMapper.toPrisma(result.value.image)

  return await reply.status(201).send({
    image: ImagePresenter.toHTTP(image)
  })
}
