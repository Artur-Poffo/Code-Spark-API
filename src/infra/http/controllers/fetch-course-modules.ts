import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type Module } from '@/domain/course-management/enterprise/entities/module'
import { makeModuleMapper } from '@/infra/database/prisma/mappers/factories/make-module-mapper'
import { makeFetchCourseModulesUseCase } from '@/infra/use-cases/factories/make-fetch-course-modules'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ModulePresenter } from '../presenters/module-presenter'

const fetchCourseModulesParamsSchema = z.object({
  courseId: z.string()
})

export async function fetchCourseModulesController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = fetchCourseModulesParamsSchema.parse(request.params)

  const fetchCourseModulesUseCase = makeFetchCourseModulesUseCase()

  const result = await fetchCourseModulesUseCase.exec({
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

  const moduleMapper = makeModuleMapper()
  const { modules } = result.value

  const infraModules = await Promise.all(
    modules.map(async (module: Module) => {
      return await moduleMapper.toPrisma(module)
    })
  )

  return await reply.status(200).send({
    courses: infraModules.map(infraModule => ModulePresenter.toHTTP(infraModule))
  })
}
