import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CompleteCourseDTO } from '../../enterprise/entities/dtos/complete-course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetCourseWithModulesAndClassesUseCaseRequest {
  courseId: string
}

type GetCourseWithModulesAndClassesUseCaseResponse = Either<
ResourceNotFoundError,
{
  completeCourse: CompleteCourseDTO
}
>

export class GetCourseWithModulesAndClassesUseCase implements UseCase<GetCourseWithModulesAndClassesUseCaseRequest, GetCourseWithModulesAndClassesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseWithModulesAndClassesUseCaseRequest): Promise<GetCourseWithModulesAndClassesUseCaseResponse> {
    const courseWithModulesAndClasses = await this.coursesRepository.findCompleteCourseEntityById(courseId)

    if (!courseWithModulesAndClasses) {
      return left(new ResourceNotFoundError())
    }

    return right({
      completeCourse: courseWithModulesAndClasses
    })
  }
}
