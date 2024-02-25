import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ImageMapper } from '@/infra/database/prisma/mappers/image-mapper'
import { makeGetImageDetailsUseCase } from '@/infra/use-cases/factories/make-get-image-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ImagePresenter } from '../presenters/image-presenter'

const getImageDetailsParamsSchema = z.object({
  fileKey: z.string()
})

export async function getImageDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { fileKey } = getImageDetailsParamsSchema.parse(request.params)

  const getImageInfoUseCase = makeGetImageDetailsUseCase()

  const result = await getImageInfoUseCase.exec({
    fileKey
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const image = ImageMapper.toPrisma(result.value.image)

  return await reply.status(200).send({
    image: ImagePresenter.toHTTP(image)
  })
}
