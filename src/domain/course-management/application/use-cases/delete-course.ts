import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface DeleteCourseUseCaseRequest {
  courseId: string
}

type DeleteCourseUseCaseResponse = Either<
ResourceNotFoundError,
{
  course: Course
}
>

export class DeleteCourseUseCase implements UseCase<DeleteCourseUseCaseRequest, DeleteCourseUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    await this.coursesRepository.delete(course)

    return right({
      course
    })
  }
}
