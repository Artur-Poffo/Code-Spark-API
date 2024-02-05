import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetCourseDetailsUseCaseRequest {
  courseId: string
}

type GetCourseDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  course: Course
}
>

export class GetCourseDetailsUseCase implements UseCase<GetCourseDetailsUseCaseRequest, GetCourseDetailsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseDetailsUseCaseRequest): Promise<GetCourseDetailsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    return right({
      course
    })
  }
}
