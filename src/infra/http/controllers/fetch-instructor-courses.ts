import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type CourseWithInstructorAndEvaluationDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-instructor-and-evaluation'
import { CourseDtoMapper } from '@/domain/course-management/enterprise/entities/dtos/mappers/course-dto-mapper'
import { makeGetCourseEvaluationsAverageUseCase } from '@/infra/use-cases/factories/make-get-course-evaluations-average-use-case'
import { makeGetInstructorWithCoursesUseCase } from '@/infra/use-cases/factories/make-get-instructor-with-courses-use-case'
import { makeGetUserInfoUseCase } from '@/infra/use-cases/factories/make-get-user-info-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CoursesWithInstructorAndEvaluationPresenter } from '../presenters/courses-with-instructor-and-evaluation-presenter'

const fetchInstructorCoursesParamsSchema = z.object({
  instructorId: z.string().uuid()
})

export async function fetchInstructorCoursesController(request: FastifyRequest, reply: FastifyReply) {
  const { instructorId } = fetchInstructorCoursesParamsSchema.parse(request.params)

  const fetchInstructorCoursesUseCase = makeGetInstructorWithCoursesUseCase()
  const getUserInfoUseCase = makeGetUserInfoUseCase()
  const getCourseEvaluationsAverageUseCase = makeGetCourseEvaluationsAverageUseCase()

  const result = await fetchInstructorCoursesUseCase.exec({
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const courses = result.value.instructorWithCourses.courses

  const coursesWithInstructorAndEvaluation: CourseWithInstructorAndEvaluationDTO[] = []

  await Promise.all(
    courses.map(async (course) => {
      const instructorResult = await getUserInfoUseCase.exec({
        id: course.instructorId.toString()
      })
      const courseEvaluationAverageResult = await getCourseEvaluationsAverageUseCase.exec({
        courseId: course.id.toString()
      })

      if (instructorResult.isLeft()) {
        const error = instructorResult.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return await reply.status(404).send({ message: error.message })
          default:
            return await reply.status(500).send({ message: error.message })
        }
      }

      if (courseEvaluationAverageResult.isLeft()) {
        return await reply.status(500).send()
      }

      const { user } = instructorResult.value
      const { evaluationsAverage } = courseEvaluationAverageResult.value

      const courseWithInstructorAndEvaluation: CourseWithInstructorAndEvaluationDTO = {
        course: CourseDtoMapper.toDTO(course),
        instructor: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          registeredAt: user.registeredAt,
          summary: user.summary,
          bannerImageKey: user.bannerImageKey,
          profileImageKey: user.profileImageKey
        },
        evaluationsAverage
      }

      coursesWithInstructorAndEvaluation.push(courseWithInstructorAndEvaluation)
    })
  )

  return await reply.status(200).send({
    courses: coursesWithInstructorAndEvaluation.map(courseWithInstructorAndEvaluation =>
      CoursesWithInstructorAndEvaluationPresenter.toHTTP(courseWithInstructorAndEvaluation
      )
    )
  })
}