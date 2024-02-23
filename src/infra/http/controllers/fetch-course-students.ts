import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type Student } from '@/domain/course-management/enterprise/entities/student'
import { makeStudentMapper } from '@/infra/database/prisma/mappers/factories/make-student-mapper'
import { makeGetCourseWithStudentsUseCase } from '@/infra/use-cases/factories/make-get-course-with-students-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserPresenter } from '../presenters/user-presenter'

const fetchCourseStudentsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function fetchCourseStudentsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = fetchCourseStudentsParamsSchema.parse(request.params)

  const fetchCourseStudentsUseCase = makeGetCourseWithStudentsUseCase()

  const result = await fetchCourseStudentsUseCase.exec({
    courseId
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

  const studentMapper = makeStudentMapper()
  const students = result.value.courseWithStudents.students

  const infraStudents = await Promise.all(
    students.map(async (student: Student) => {
      return await studentMapper.toPrisma(student)
    })
  )

  return await reply.status(200).send({
    students: infraStudents.map(infraStudent => UserPresenter.toHTTP(infraStudent))
  })
}
