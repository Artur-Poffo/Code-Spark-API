import { makeTagMapper } from '../../mappers/factories/make-tag-mapper'
import { PrismaTagsRepository } from './../prisma-tags-repository'

export function makePrismaTagsRepository() {
  const tagMapper = makeTagMapper()
  const prismaTagsRepository = new PrismaTagsRepository(tagMapper)

  return prismaTagsRepository
}
