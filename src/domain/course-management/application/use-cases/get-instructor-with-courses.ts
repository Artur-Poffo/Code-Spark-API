import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type InstructorWithCoursesDTO } from '../../enterprise/entities/dtos/instructor-with-courses'
import { type InstructorsRepository } from '../repositories/instructors-repository'

interface GetInstructorWithCoursesUseCaseRequest {
  instructorId: string
}

type GetInstructorWithCoursesUseCaseResponse = Either<
ResourceNotFoundError,
{
  instructor: InstructorWithCoursesDTO
}
>

export class GetInstructorWithCoursesUseCase implements UseCase<GetInstructorWithCoursesUseCaseRequest, GetInstructorWithCoursesUseCaseResponse> {
  constructor(
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    instructorId
  }: GetInstructorWithCoursesUseCaseRequest): Promise<GetInstructorWithCoursesUseCaseResponse> {
    const instructorWithCourses = await this.instructorsRepository.findInstructorWithCoursesById(instructorId)

    if (!instructorWithCourses) {
      return left(new ResourceNotFoundError())
    }

    return right({
      instructor: instructorWithCourses
    })
  }
}
