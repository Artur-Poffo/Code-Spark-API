import { GetCourseInstructorDetailsUseCase } from '@/domain/course-management/application/use-cases/get-course-instructor-details'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'

export function makeGetCourseInstructorDetailsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaInstructorsRepository = makePrismaInstructorsRepository()

  const getCourseDetailsUseCase = new GetCourseInstructorDetailsUseCase(
    prismaCoursesRepository,
    prismaInstructorsRepository
  )

  return getCourseDetailsUseCase
}
