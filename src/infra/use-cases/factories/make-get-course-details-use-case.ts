import { GetCourseDetailsUseCase } from '@/domain/course-management/application/use-cases/get-course-details'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetCourseDetailsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getCourseDetailsUseCase = new GetCourseDetailsUseCase(
    prismaCoursesRepository
  )

  return getCourseDetailsUseCase
}
