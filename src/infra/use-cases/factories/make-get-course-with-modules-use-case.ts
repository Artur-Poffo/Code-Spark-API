import { GetCourseWithModulesUseCase } from '@/domain/course-management/application/use-cases/get-course-with-modules'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetCourseWithModulesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getCourseWithModulesUseCase = new GetCourseWithModulesUseCase(
    prismaCoursesRepository
  )

  return getCourseWithModulesUseCase
}
