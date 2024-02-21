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
    return reply.status(404).send({
      message: 'Video required'
    })
  }

  const uploadVideoUseCase = makeUploadVideoUseCase()

  const result = await uploadVideoUseCase.exec({
    body: request.file.buffer,
    videoName: request.file.originalname,
    videoType: request.file.mimetype as 'video/mp4' | 'video/avi',
    size: request.file.size,
    duration: 24
  })

  if (result.isLeft()) {
    return reply.status(500).send()
  }

  reply.status(201).send({
    video: result.value.video
  })
}
