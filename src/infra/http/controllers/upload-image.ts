import { makeUploadImageUseCase } from '@/infra/use-cases/factories/make-upload-image-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'

interface MulterRequest extends FastifyRequest {
  file?: {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
  }
}

export async function uploadImageController(request: MulterRequest, reply: FastifyReply) {
  const uploadImageUseCase = makeUploadImageUseCase()

  if (!request.file) {
    return reply.status(404).send({
      message: 'Image required'
    })
  }

  const result = await uploadImageUseCase.exec({
    body: request.file.buffer,
    imageName: request.file.originalname,
    imageType: request.file.mimetype as 'image/jpeg' | 'image/png',
    size: request.file.size
  })

  if (result.isLeft()) {
    return reply.status(500).send()
  }

  reply.status(201).send({
    image: result.value.image
  })
}
