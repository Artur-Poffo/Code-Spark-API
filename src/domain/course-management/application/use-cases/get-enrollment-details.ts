import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Enrollment } from '../../enterprise/entities/enrollment'
import { type EnrollmentsRepository } from './../repositories/enrollments-repository'

interface GetEnrollmentDetailsUseCaseRequest {
  studentId: string
  courseId: string
}

type GetEnrollmentDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  enrollment: Enrollment
}
>

export class GetEnrollmentDetailsUseCase implements UseCase<GetEnrollmentDetailsUseCaseRequest, GetEnrollmentDetailsUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository
  ) { }

  async exec({
    studentId,
    courseId
  }: GetEnrollmentDetailsUseCaseRequest): Promise<GetEnrollmentDetailsUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findByStudentIdAndCourseId(
      studentId,
      courseId
    )

    if (!enrollment) {
      return left(new ResourceNotFoundError())
    }

    return right({
      enrollment
    })
  }
}
