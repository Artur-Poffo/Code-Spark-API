import { GetInstructorWithCoursesUseCase } from '@/domain/course-management/application/use-cases/get-instructor-with-courses'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetInstructorWithCoursesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getInstructorWithCoursesUseCase = new GetInstructorWithCoursesUseCase(
    prismaCoursesRepository
  )

  return getInstructorWithCoursesUseCase
}
