import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type ModulesRepository } from '../repositories/modules-repository'
import { type CoursesRepository } from './../repositories/courses-repository'

interface FetchCourseModulesUseCaseRequest {
  courseId: string
}

type FetchCourseModulesUseCaseResponse = Either<
ResourceNotFoundError,
{
  modules: Module[]
}
>

export class FetchCourseModulesUseCase implements UseCase<FetchCourseModulesUseCaseRequest, FetchCourseModulesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    courseId
  }: FetchCourseModulesUseCaseRequest): Promise<FetchCourseModulesUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseModules = await this.modulesRepository.findManyByCourseId(courseId)

    return right({
      modules: courseModules
    })
  }
}
