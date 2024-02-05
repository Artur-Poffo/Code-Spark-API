import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'
import { CourseAlreadyExistsInThisAccountError } from './errors/course-already-exists-in-this-account-error'

interface RegisterCourseUseCaseRequest {
  name: string
  description: string
  instructorId: string
}

type RegisterCourseUseCaseResponse = Either<
ResourceNotFoundError | CourseAlreadyExistsInThisAccountError,
{
  course: Course
}
>

export class RegisterCourseUseCase implements UseCase<RegisterCourseUseCaseRequest, RegisterCourseUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    name,
    description,
    instructorId
  }: RegisterCourseUseCaseRequest): Promise<RegisterCourseUseCaseResponse> {
    const instructorWithCourses = await this.coursesRepository.findInstructorWithCoursesByInstructorId(instructorId)

    if (!instructorWithCourses) {
      return left(new ResourceNotFoundError())
    }

    const courseWithSameNameInSameAccount = instructorWithCourses.courses.find(courseToCompare => courseToCompare.name === name)

    if (courseWithSameNameInSameAccount) {
      return left(new CourseAlreadyExistsInThisAccountError(instructorWithCourses.instructor.email))
    }

    const course = Course.create({
      name,
      description,
      instructorId: new UniqueEntityID(instructorId)
    })

    await this.coursesRepository.create(course)

    return right({
      course
    })
  }
}
