import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from '../repositories/modules-repository'
import { ModuleAlreadyExistsInThisCourse } from './errors/module-already-exists-in-this-course'

interface RegisterModuleToCourseUseCaseRequest {
  name: string
  description: string
  courseId: string
  instructorId: string
}

type RegisterModuleToCourseUseCaseResponse = Either<
ResourceNotFoundError | ModuleAlreadyExistsInThisCourse | NotAllowedError,
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
    courseId,
    instructorId
  }: RegisterModuleToCourseUseCaseRequest): Promise<RegisterModuleToCourseUseCaseResponse> {
    const course = await this.coursesRepository.findCompleteCourseEntityById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    if (course.instructorId.toString() !== instructorId) {
      return left(new NotAllowedError())
    }

    const moduleWithSameNameInSameCourse = course.modules.find(moduleToCompare => moduleToCompare.name === name)

    if (moduleWithSameNameInSameCourse) {
      return left(new ModuleAlreadyExistsInThisCourse(name))
    }

    const module = Module.create({
      name,
      description,
      courseId: new UniqueEntityID(courseId)
    })

    await this.modulesRepository.create(module)

    return right({
      module
    })
  }
}
