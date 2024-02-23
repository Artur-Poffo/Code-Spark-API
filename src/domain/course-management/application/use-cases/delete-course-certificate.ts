import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Certificate } from '../../enterprise/entities/certificate'
import { type CertificatesRepository } from '../repositories/certificates-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'

interface DeleteCourseCertificateUseCaseRequest {
  certificateId: string
  courseId: string
  instructorId: string
}

type DeleteCourseCertificateUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  certificate: Certificate
}
>

export class DeleteCourseCertificateUseCase implements UseCase<DeleteCourseCertificateUseCaseRequest, DeleteCourseCertificateUseCaseResponse> {
  constructor(
    private readonly certificatesRepository: CertificatesRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    certificateId,
    courseId,
    instructorId
  }: DeleteCourseCertificateUseCaseRequest): Promise<DeleteCourseCertificateUseCaseResponse> {
    const [certificate, course, instructor] = await Promise.all([
      this.certificatesRepository.findById(certificateId),
      this.coursesRepository.findById(courseId),
      this.instructorsRepository.findById(instructorId)
    ])

    if (!certificate || !course || !instructor) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheOwner = course.instructorId.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    const certificatePertenceToCourse = certificate.courseId.toString() === courseId

    if (!certificatePertenceToCourse) {
      return left(new NotAllowedError())
    }

    await this.certificatesRepository.delete(certificate)

    return right({
      certificate
    })
  }
}
