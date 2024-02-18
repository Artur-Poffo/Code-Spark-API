import { AttachTagToCourseUseCase } from '@/domain/course-management/application/use-cases/attach-tag-to-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'
import { PrismaCourseTagsRepository } from '@/infra/database/prisma/repositories/prisma-course-tags-repository'

export function makeAttachTagToCourseUseCase() {
  const prismaCourseTagsRepository = new PrismaCourseTagsRepository()
  const prismaTagsRepository = makePrismaTagsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const attachTagToCourseUseCase = new AttachTagToCourseUseCase(
    prismaCourseTagsRepository,
    prismaTagsRepository,
    prismaCoursesRepository
  )

  return attachTagToCourseUseCase
}
