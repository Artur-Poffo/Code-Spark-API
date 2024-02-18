import { RemoveTagFromCourseUseCase } from '@/domain/course-management/application/use-cases/remove-tag-from-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'
import { PrismaCourseTagsRepository } from '@/infra/database/prisma/repositories/prisma-course-tags-repository'

export function makeRemoveTagFromCourseUseCase() {
  const prismaTagsRepository = makePrismaTagsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaInstructorsRepository = makePrismaInstructorsRepository()
  const prismaCourseTagsRepository = new PrismaCourseTagsRepository()

  const removeTagFromCourseUseCase = new RemoveTagFromCourseUseCase(
    prismaTagsRepository,
    prismaCoursesRepository,
    prismaInstructorsRepository,
    prismaCourseTagsRepository
  )

  return removeTagFromCourseUseCase
}
