import { GetCourseWithModulesAndClassesUseCase } from '@/domain/course-management/application/use-cases/get-course-with-modules-and-classes'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetCourseWithModulesAndClassesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getCourseWithModulesAndClassesUseCase = new GetCourseWithModulesAndClassesUseCase(
    prismaCoursesRepository
  )

  return getCourseWithModulesAndClassesUseCase
}
