import { EditCourseDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-course-details'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeEditCourseDetailsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const editCourseDetailsUseCase = new EditCourseDetailsUseCase(
    prismaCoursesRepository
  )

  return editCourseDetailsUseCase
}
