import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeInstructorMapper } from '@/infra/database/prisma/mappers/factories/make-instructor-mapper'
import { makeStudentMapper } from '@/infra/database/prisma/mappers/factories/make-student-mapper'
import { makeEditInstructorDetailsUseCase } from '@/infra/use-cases/factories/make-edit-instructor-details-use-case'
import { makeEditStudentDetailsUseCase } from '@/infra/use-cases/factories/make-edit-student-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserPresenter } from '../presenters/user-presenter'

const editUserDetailsBodySchema = z.object({
  email: z.string().email().optional(),
  age: z.number().optional(),
  summary: z.string().optional(),
  profileImageKey: z.string().optional(),
  bannerImageKey: z.string().optional()
})

export async function editUserDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { email, age, summary, bannerImageKey, profileImageKey } = editUserDetailsBodySchema.parse(request.body)
  const { role } = request.user

  if (role === 'STUDENT') {
    const editStudentDetailsUseCase = makeEditStudentDetailsUseCase()

    const result = await editStudentDetailsUseCase.exec({
      email,
      age,
      summary,
      bannerImageKey,
      profileImageKey,
      studentId: request.user.sub
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
    const { student } = result.value

    const infraUser = await studentMapper.toPrisma(student)

    return await reply.status(200).send({
      user: UserPresenter.toHTTP(infraUser)
    })
  }

  if (role === 'INSTRUCTOR') {
    const EditInstructorDetailsUseCase = makeEditInstructorDetailsUseCase()

    const result = await EditInstructorDetailsUseCase.exec({
      email,
      age,
      summary,
      bannerImageKey,
      profileImageKey,
      instructorId: request.user.sub
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

    const instructorMapper = makeInstructorMapper()
    const { instructor } = result.value

    const infraUser = await instructorMapper.toPrisma(instructor)

    return await reply.status(200).send({
      user: UserPresenter.toHTTP(infraUser)
    })
  }
}
