import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Enrollment } from '../../enterprise/entities/enrollment'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'

interface CancelEnrollmentUseCaseRequest {
  enrollmentId: string
  studentId: string
}

type CancelEnrollmentUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  enrollment: Enrollment
}
>

export class CancelEnrollmentUseCase implements UseCase<CancelEnrollmentUseCaseRequest, CancelEnrollmentUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId
  }: CancelEnrollmentUseCaseRequest): Promise<CancelEnrollmentUseCaseResponse> {
    const [enrollment, student] = await Promise.all([
      this.enrollmentsRepository.findById(enrollmentId),
      this.studentsRepository.findById(studentId)
    ])

    if (!enrollment || !student) {
      return left(new ResourceNotFoundError())
    }

    const studentIsTheOwner = enrollment.studentId.toString() === studentId

    if (!studentIsTheOwner) {
      return left(new NotAllowedError())
    }

    await this.enrollmentsRepository.delete(enrollment)

    return right({
      enrollment
    })
  }
}
