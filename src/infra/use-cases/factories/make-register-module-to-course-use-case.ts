import { RegisterModuleToCourseUseCase } from '@/domain/course-management/application/use-cases/register-module-to-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeRegisterModuleToCourseUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()

  const registerModuleToCourseUseCase = new RegisterModuleToCourseUseCase(
    prismaCoursesRepository,
    prismaModulesRepository
  )

  return registerModuleToCourseUseCase
}
