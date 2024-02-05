import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetCourseWithStudentsUseCaseRequest {
  courseId: string
}

type GetCourseWithStudentsUseCaseResponse = Either<
ResourceNotFoundError,
{
  courseWitStudents: Course
}
>

export class GetCourseWithStudentsUseCase implements UseCase<GetCourseWithStudentsUseCaseRequest, GetCourseWithStudentsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseWithStudentsUseCaseRequest): Promise<GetCourseWithStudentsUseCaseResponse> {
    const courseWitStudents = await this.coursesRepository.findById(courseId)

    if (!courseWitStudents) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courseWitStudents
    })
  }
}
