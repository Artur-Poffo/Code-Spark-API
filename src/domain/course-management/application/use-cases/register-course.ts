import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'
import { CourseAlreadyExistsInThisAccount } from './errors/course-already-exists-in-this-account'

interface RegisterCourseUseCaseRequest {
  name: string
  description: string
  instructorId: string
}

type RegisterCourseUseCaseResponse = Either<
ResourceNotFoundError | CourseAlreadyExistsInThisAccount,
{
  course: Course
}
>

export class RegisterCourseUseCase implements UseCase<RegisterCourseUseCaseRequest, RegisterCourseUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    name,
    description,
    instructorId
  }: RegisterCourseUseCaseRequest): Promise<RegisterCourseUseCaseResponse> {
    const instructor = await this.instructorsRepository.findInstructorWithCoursesById(instructorId)

    if (!instructor) {
      return left(new ResourceNotFoundError())
    }

    const courseWithSameNameInSameAccount = instructor.courses.find(courseToCompare => courseToCompare.name === name)

    if (courseWithSameNameInSameAccount) {
      return left(new CourseAlreadyExistsInThisAccount(instructor.email))
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
