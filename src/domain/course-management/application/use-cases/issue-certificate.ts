import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { StudentCertificate } from '../../enterprise/entities/student-certificate'
import { type CertificatesRepository } from '../repositories/certificates-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type EnrollmentsRepository } from './../repositories/enrollments-repository'
import { type StudentCertificatesRepository } from './../repositories/student-certificates-repository'
import { CertificateHasAlreadyBeenIssued } from './errors/certificate-has-already-been-issued-error'
import { CompleteTheCourseBeforeTheCertificateIIsIssuedError } from './errors/complete-the-course-before-the-certificate-is-issued-error'

interface IssueCertificateUseCaseRequest {
  enrollmentId: string
  studentId: string
}

type IssueCertificateUseCaseResponse = Either<
ResourceNotFoundError | CertificateHasAlreadyBeenIssued | CompleteTheCourseBeforeTheCertificateIIsIssuedError,
{
  issuedCertificate: StudentCertificate
}
>

export class IssueCertificateUseCase implements UseCase<IssueCertificateUseCaseRequest, IssueCertificateUseCaseResponse> {
  constructor(
    private readonly certificatesRepository: CertificatesRepository,
    private readonly studentCertificatesRepository: StudentCertificatesRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId
  }: IssueCertificateUseCaseRequest): Promise<IssueCertificateUseCaseResponse> {
    const [enrollment, student] = await Promise.all([
      this.enrollmentsRepository.findById(enrollmentId),
      this.studentsRepository.findById(studentId)
    ])

    if (!enrollment || !student) {
      return left(new ResourceNotFoundError())
    }

    const courseCertificate = await this.certificatesRepository.findByCourseId(enrollment.courseId.toString())

    if (!courseCertificate) {
      return left(new ResourceNotFoundError())
    }

    const certificateHasAlreadyBeenIssued = await this.studentCertificatesRepository.findByStudentIdAndCertificateId(
      student.id.toString(),
      courseCertificate.id.toString()
    )

    if (certificateHasAlreadyBeenIssued) {
      return left(new CertificateHasAlreadyBeenIssued())
    }

    const courseIsCompleted = !!enrollment.completedAt

    if (!courseIsCompleted) {
      return left(new CompleteTheCourseBeforeTheCertificateIIsIssuedError())
    }

    const issuedCertificate = StudentCertificate.create({
      studentId: student.id,
      certificateId: courseCertificate.id
    })

    await this.studentCertificatesRepository.create(issuedCertificate)

    return right({
      issuedCertificate
    })
  }
}
