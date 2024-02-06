import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CourseWithStudentsDTO } from '../../enterprise/entities/dtos/course-with-students'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetCourseWithStudentsUseCaseRequest {
  courseId: string
}

type GetCourseWithStudentsUseCaseResponse = Either<
ResourceNotFoundError,
{
  courseWithStudents: CourseWithStudentsDTO
}
>

export class GetCourseWithStudentsUseCase implements UseCase<GetCourseWithStudentsUseCaseRequest, GetCourseWithStudentsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseWithStudentsUseCaseRequest): Promise<GetCourseWithStudentsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseWithTheirStudents = await this.coursesRepository.findCourseWithStudentsById(course.id.toString())

    if (!courseWithTheirStudents) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courseWithStudents: courseWithTheirStudents
    })
  }
}
