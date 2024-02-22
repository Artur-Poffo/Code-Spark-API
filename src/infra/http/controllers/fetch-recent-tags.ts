import { type Tag } from '@/domain/course-management/enterprise/entities/tag'
import { makeTagMapper } from '@/infra/database/prisma/mappers/factories/make-tag-mapper'
import { makeFetchRecentTagsUseCase } from '@/infra/use-cases/factories/make-fetch-recent-tags-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { TagPresenter } from '../presenters/tag-presenter'

export async function fetchRecentTagsController(request: FastifyRequest, reply: FastifyReply) {
  const fetchRecentTagsUseCase = makeFetchRecentTagsUseCase()

  const result = await fetchRecentTagsUseCase.exec()

  if (result.isLeft()) {
    return await reply.status(500).send()
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
