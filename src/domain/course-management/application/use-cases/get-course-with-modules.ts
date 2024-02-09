import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CourseWithModulesDTO } from '../../enterprise/entities/dtos/course-with-modules'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetCourseWithModulesUseCaseRequest {
  courseId: string
}

type GetCourseWithModulesUseCaseResponse = Either<
ResourceNotFoundError,
{
  courseWithModules: CourseWithModulesDTO
}
>

export class GetCourseWithModulesUseCase implements UseCase<GetCourseWithModulesUseCaseRequest, GetCourseWithModulesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseWithModulesUseCaseRequest): Promise<GetCourseWithModulesUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseWithTheirModules = await this.coursesRepository.findCourseWithModulesById(course.id.toString())

    if (!courseWithTheirModules) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courseWithModules: courseWithTheirModules
    })
  }
}
