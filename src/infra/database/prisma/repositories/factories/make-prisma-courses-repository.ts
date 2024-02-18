import { makeCourseMapper } from '../../mappers/factories/make-course-mapper'
import { PrismaCoursesRepository } from './../prisma-courses-repository'

export function makePrismaCoursesRepository() {
  const courseMapper = makeCourseMapper()
  const prismaCoursesRepository = new PrismaCoursesRepository(courseMapper)

  return prismaCoursesRepository
}
