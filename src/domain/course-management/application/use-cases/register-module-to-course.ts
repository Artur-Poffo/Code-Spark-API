import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from '../repositories/modules-repository'
import { ModuleAlreadyExistsInThisCourseError } from './errors/module-already-exists-in-this-course-error'
import { ModuleNumberIsAlreadyInUseError } from './errors/module-number-already-in-use-error'

interface RegisterModuleToCourseUseCaseRequest {
  name: string
  description: string
  moduleNumber: number
  courseId: string
  instructorId: string
}

type RegisterModuleToCourseUseCaseResponse = Either<
ResourceNotFoundError | ModuleAlreadyExistsInThisCourseError | NotAllowedError | ModuleNumberIsAlreadyInUseError,
{
  module: Module
}
>

export class RegisterModuleToCourseUseCase implements UseCase<RegisterModuleToCourseUseCaseRequest, RegisterModuleToCourseUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    name,
    description,
    moduleNumber,
    courseId,
    instructorId
  }: RegisterModuleToCourseUseCaseRequest): Promise<RegisterModuleToCourseUseCaseResponse> {
    const completeCourse = await this.coursesRepository.findCompleteCourseEntityById(courseId)

    if (!completeCourse) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheSponsor = completeCourse.instructorId.toString() !== instructorId

    if (instructorIsTheSponsor) {
      return left(new NotAllowedError())
    }

    const moduleWithSameNameInSameCourse = completeCourse.modules.find(moduleToCompare => moduleToCompare.module.name === name)

    if (moduleWithSameNameInSameCourse) {
      return left(new ModuleAlreadyExistsInThisCourseError(name))
    }

    const moduleWithSamePositionInThisCourse = completeCourse.modules.find(moduleToCompare => moduleToCompare.module.moduleNumber === moduleNumber)

    if (moduleWithSamePositionInThisCourse) {
      return left(new ModuleNumberIsAlreadyInUseError(moduleNumber))
    }

    const module = Module.create({
      name,
      description,
      moduleNumber,
      courseId: new UniqueEntityID(courseId)
    })

    await this.modulesRepository.create(module)

    return right({
      module
    })
  }
}
