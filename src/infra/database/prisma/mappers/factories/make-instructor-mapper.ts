import { PrismaCoursesRepository } from './../../repositories/prisma-courses-repository'
import { InstructorMapper } from './../instructor-mapper'
import { makeCourseMapper } from './make-course-mapper'

export function makeInstructorMapper() {
  const courseMapper = makeCourseMapper()

  const prismaCoursesRepository = new PrismaCoursesRepository(
    courseMapper
  )

  const instructorMapper = new InstructorMapper(
    prismaCoursesRepository
  )

  return instructorMapper
}
