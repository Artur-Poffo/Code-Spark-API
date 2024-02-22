import { GetVideoDuration } from '@/infra/storage/utils/get-video-duration'
import { makeUploadVideoUseCase } from '@/infra/use-cases/factories/make-upload-video-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'

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
    return await reply.status(500).send()
  }

  return await reply.status(201).send()
}
