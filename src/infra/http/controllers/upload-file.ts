import { InvalidMimeTypeError } from '@/domain/storage/application/use-cases/errors/invalid-mime-type-error'
import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'

interface MulterRequest extends FastifyRequest {
  file?: {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
  }
}

export async function uploadFileController(request: MulterRequest, reply: FastifyReply) {
  const uploadFileUseCase = makeUploadFileUseCase()

  if (!request.file) {
    return reply.status(404).send({
      message: 'File required'
    })
  }

  const result = await uploadFileUseCase.exec({
    body: request.file.buffer,
    fileName: request.file.originalname,
    fileType: request.file.mimetype,
    size: request.file.size,
    storedAt: new Date()
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case InvalidMimeTypeError:
        return reply.status(415).send()
      default:
        return reply.status(500).send()
    }
  }

  reply.status(201).send({
    file: result.value.file
  })
}
