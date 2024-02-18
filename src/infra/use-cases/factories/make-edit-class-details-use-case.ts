import { EditClassDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-class-details'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'

export function makeEditClassDetailsUseCase() {
  const prismaVideosRepository = new PrismaVideosRepository()
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const editClassDetailsUseCase = new EditClassDetailsUseCase(
    prismaClassesRepository,
    prismaVideosRepository,
    prismaModulesRepository,
    prismaCoursesRepository
  )

  return editClassDetailsUseCase
}
