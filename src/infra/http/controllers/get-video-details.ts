import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { VideoMapper } from '@/infra/database/prisma/mappers/video-mapper'
import { makeGetVideoDetailsUseCase } from '@/infra/use-cases/factories/make-get-video-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { VideoPresenter } from '../presenters/video-presenter'

const getVideoDetailsParamsSchema = z.object({
  videoId: z.string().uuid()
})

export async function getVideoDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { videoId } = getVideoDetailsParamsSchema.parse(request.params)

  const getVideoInfoUseCase = makeGetVideoDetailsUseCase()

  const result = await getVideoInfoUseCase.exec({
    videoId
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

  const video = VideoMapper.toPrisma(result.value.video)

  return await reply.status(200).send({
    video: VideoPresenter.toHTTP(video)
  })
}
