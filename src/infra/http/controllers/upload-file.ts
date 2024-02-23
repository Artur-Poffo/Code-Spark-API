import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { makeFileMapper } from '@/infra/database/prisma/mappers/factories/make-file-mapper'
import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { FilePresenter } from '../presenters/file-presenter'

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

  const fileMapper = makeFileMapper()
  const file = await fileMapper.toPrisma(result.value.file)

  return await reply.status(201).send({
    file: FilePresenter.toHTTP(file)
  })
}
