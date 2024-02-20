import { type Course } from '@/domain/course-management/enterprise/entities/course'
import { makeCourseMapper } from '@/infra/database/prisma/mappers/factories/make-course-mapper'
import { makeFetchRecentCoursesUseCase } from '@/infra/use-cases/factories/make-fetch-recent-courses-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { CoursePresenter } from '../presenters/course-presenter'

export async function fetchRecentCoursesController(request: FastifyRequest, reply: FastifyReply) {
  const fetchRecentCoursesUseCase = makeFetchRecentCoursesUseCase()

  const result = await fetchRecentCoursesUseCase.exec()

  if (result.isLeft()) {
    return await reply.status(500).send()
  }

  const courseMapper = makeCourseMapper()
  const { courses } = result.value

  const infraCourses = await Promise.all(
    courses.map(async (course: Course) => {
      return await courseMapper.toPrisma(course)
    })
  )

  return await reply.status(200).send({
    courses: infraCourses.map(infraCourse => CoursePresenter.toHTTP(infraCourse))
  })
}
