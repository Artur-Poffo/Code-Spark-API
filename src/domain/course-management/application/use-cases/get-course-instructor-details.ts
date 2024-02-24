import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Instructor } from '../../enterprise/entities/instructor'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'

interface GetCourseInstructorDetailsUseCaseRequest {
  courseId: string
}

type GetCourseInstructorDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  instructor: Instructor
}
>

export class GetCourseInstructorDetailsUseCase implements UseCase<GetCourseInstructorDetailsUseCaseRequest, GetCourseInstructorDetailsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    courseId
  }: GetCourseInstructorDetailsUseCaseRequest): Promise<GetCourseInstructorDetailsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseInstructor = await this.instructorsRepository.findById(course.instructorId.toString())

    if (!courseInstructor) {
      return left(new ResourceNotFoundError())
    }

    return right({
      instructor: courseInstructor
    })
  }
}
