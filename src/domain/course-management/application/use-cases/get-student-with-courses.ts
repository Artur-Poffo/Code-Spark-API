import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type StudentWithCoursesDTO } from '../../enterprise/entities/dtos/student-with-courses'
import { type CoursesRepository } from '../repositories/courses-repository'

interface GetStudentWithCoursesUseCaseRequest {
  studentId: string
}

type GetStudentWithCoursesUseCaseResponse = Either<
ResourceNotFoundError,
{
  studentWithCourses: StudentWithCoursesDTO
}
>

export class GetStudentWithCoursesUseCase implements UseCase<GetStudentWithCoursesUseCaseRequest, GetStudentWithCoursesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    studentId
  }: GetStudentWithCoursesUseCaseRequest): Promise<GetStudentWithCoursesUseCaseResponse> {
    const studentWithCourses = await this.coursesRepository.findStudentWithCoursesByStudentId(studentId)

    if (!studentWithCourses) {
      return left(new ResourceNotFoundError())
    }

    return right({
      studentWithCourses
    })
  }
}
