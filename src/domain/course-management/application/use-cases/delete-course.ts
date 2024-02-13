import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface DeleteCourseUseCaseRequest {
  courseId: string
  instructorId: string
}

type DeleteCourseUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  course: Course
}
>

export class DeleteCourseUseCase implements UseCase<DeleteCourseUseCaseRequest, DeleteCourseUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId,
    instructorId
  }: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheOwner = course.instructorId.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    await this.coursesRepository.delete(course)

    return right({
      course
    })
  }
}
