import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { VideoMapper } from '@/infra/database/prisma/mappers/video-mapper'
import { GetVideoDuration } from '@/infra/storage/utils/get-video-duration'
import { makeUploadVideoUseCase } from '@/infra/use-cases/factories/make-upload-video-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { VideoPresenter } from '../presenters/video-presenter'

interface MulterRequest extends FastifyRequest {
  file?: {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
  }
}

export async function uploadVideoController(request: MulterRequest, reply: FastifyReply) {
  if (!request.file) {
    return await reply.status(404).send({
      message: 'Video required'
    })
  }

  const videoDuration = await new GetVideoDuration().getInSecondsByBuffer(request.file.buffer)

  const uploadVideoUseCase = makeUploadVideoUseCase()

  const result = await uploadVideoUseCase.exec({
    body: request.file.buffer,
    videoName: request.file.originalname,
    videoType: request.file.mimetype as 'video/mp4' | 'video/avi',
    size: request.file.size,
    duration: videoDuration
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

  const video = VideoMapper.toPrisma(result.value.video)

  return await reply.status(201).send({
    video: VideoPresenter.toHTTP(video)
  })
}
