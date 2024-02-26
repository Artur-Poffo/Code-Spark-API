import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ImageMapper } from '@/infra/database/prisma/mappers/image-mapper'
import { VideoMapper } from '@/infra/database/prisma/mappers/video-mapper'
import { makeGetImageDetailsUseCase } from '@/infra/use-cases/factories/make-get-image-details-use-case'
import { makeGetVideoDetailsUseCase } from '@/infra/use-cases/factories/make-get-video-details-use-case'
import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { ImagePresenter } from '../presenters/image-presenter'
import { VideoPresenter } from '../presenters/video-presenter'

interface MulterRequest extends FastifyRequest {
  file?: {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
  }
}

export async function uploadFileController(request: MulterRequest, reply: FastifyReply) {
  if (!request.file) {
    return await reply.status(404).send({
      message: 'File required'
    })
  }

  const uploadFileUseCase = makeUploadFileUseCase()
  const getVideoDetailsUseCase = makeGetVideoDetailsUseCase()
  const getImageDetailsUseCase = makeGetImageDetailsUseCase()

  const result = await uploadFileUseCase.exec({
    body: request.file.buffer,
    fileName: request.file.originalname,
    fileType: request.file.mimetype,
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

  const { file } = result.value

  if (file.fileType === 'video/mp4' || file.fileType === 'video/avi') {
    const videoResult = await getVideoDetailsUseCase.exec({
      fileKey: file.fileKey
    })

    if (videoResult.isLeft()) {
      const error = videoResult.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          return await reply.status(404).send({ message: error.message })
        default:
          return await reply.status(500).send({ message: error.message })
      }
    }

    const video = VideoMapper.toPrisma(videoResult.value.video)

    return await reply.status(201).send({
      file: VideoPresenter.toHTTP(video)
    })
  } else if (file.fileType === 'image/jpeg' || file.fileType === 'image/png') {
    const imageResult = await getImageDetailsUseCase.exec({
      fileKey: result.value.file.fileKey
    })

    if (imageResult.isLeft()) {
      const error = imageResult.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          return await reply.status(404).send({ message: error.message })
        default:
          return await reply.status(500).send({ message: error.message })
      }
    }

    const image = ImageMapper.toPrisma(imageResult.value.image)

    return await reply.status(201).send({
      file: ImagePresenter.toHTTP(image)
    })
  }
}
