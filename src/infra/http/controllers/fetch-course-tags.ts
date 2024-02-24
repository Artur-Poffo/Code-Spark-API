import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type Tag } from '@/domain/course-management/enterprise/entities/tag'
import { makeTagMapper } from '@/infra/database/prisma/mappers/factories/make-tag-mapper'
import { makeFetchCourseTagsUseCase } from '@/infra/use-cases/factories/make-fetch-course-tags-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { TagPresenter } from '../presenters/tag-presenter'

const fetchCourseTagsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function fetchCourseTagsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = fetchCourseTagsParamsSchema.parse(request.params)

  const fetchCourseTagsUseCase = makeFetchCourseTagsUseCase()

  const result = await fetchCourseTagsUseCase.exec({
    courseId
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

  const tagMapper = makeTagMapper()
  const { tags } = result.value

  const infraTags = await Promise.all(
    tags.map(async (tag: Tag) => {
      return await tagMapper.toPrisma(tag)
    })
  )

  return await reply.status(200).send({
    tags: infraTags.map(infraTag => TagPresenter.toHTTP(infraTag))
  })
}
