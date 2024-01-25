import { left, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'

interface RegisterModuleToCourseUseCaseRequest {
  name: string
  description: string
  courseId: string
}

type RegisterModuleToCourseUseCaseResponse = Either<
ResourceNotFoundError,
{
  module: Module
}
>

export class RegisterModuleToCourseUseCase implements UseCase<RegisterModuleToCourseUseCaseRequest, RegisterModuleToCourseUseCaseResponse> {
  constructor(
    private readonly instructorsRepository: InstructorsRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    name,
    description,
    courseId
  }: RegisterModuleToCourseUseCaseRequest): Promise<RegisterModuleToCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }
  }
}
