import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'
import { AddClassToModuleUseCase } from './../../../domain/course-management/application/use-cases/add-class-to-module'

export function makeAddClassToModuleUseCase() {
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaVideosRepository = new PrismaVideosRepository()

  const addClassToModuleUseCase = new AddClassToModuleUseCase(
    prismaClassesRepository,
    prismaModulesRepository,
    prismaCoursesRepository,
    prismaVideosRepository
  )

  return addClassToModuleUseCase
}
