import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type ModulesRepository } from '../repositories/modules-repository'
import { type CoursesRepository } from './../repositories/courses-repository'

interface FetchCourseClassesUseCaseRequest {
  courseId: string
}

type FetchCourseClassesUseCaseResponse = Either<
ResourceNotFoundError,
{
  classes: Class[]
}
>

export class FetchCourseClassesUseCase implements UseCase<FetchCourseClassesUseCaseRequest, FetchCourseClassesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    courseId
  }: FetchCourseClassesUseCaseRequest): Promise<FetchCourseClassesUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseClasses = await this.modulesRepository.findManyClassesByCourseId(courseId)

    return right({
      classes: courseClasses
    })
  }
}
