import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Certificate } from '../../enterprise/entities/certificate'
import { type CertificatesRepository } from '../repositories/certificates-repository'
import { type ImagesRepository } from '../repositories/images-repository'
import { type CoursesRepository } from './../repositories/courses-repository'
import { CourseAlreadyHasACertificateError } from './errors/course-already-has-a-certificate-error'

interface RegisterCertificateForCourseUseCaseRequest {
  imageId: string
  courseId: string
  instructorId: string
}

type RegisterCertificateForCourseUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  certificate: Certificate
}
>

export class RegisterCertificateForCourseUseCase implements UseCase<RegisterCertificateForCourseUseCaseRequest, RegisterCertificateForCourseUseCaseResponse> {
  constructor(
    private readonly certificatesRepository: CertificatesRepository,
    private readonly imagesRepository: ImagesRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    imageId,
    courseId,
    instructorId
  }: RegisterCertificateForCourseUseCaseRequest): Promise<RegisterCertificateForCourseUseCaseResponse> {
    const [image, course] = await Promise.all([
      this.imagesRepository.findById(imageId),
      this.coursesRepository.findById(courseId)
    ])

    if (!image || !course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheSponsor = course.instructorId.toString() === instructorId

    if (!instructorIsTheSponsor) {
      return left(new NotAllowedError())
    }

    const courseAlreadyHasACertificate = await this.certificatesRepository.findByCourseId(courseId)

    if (courseAlreadyHasACertificate) {
      return left(new CourseAlreadyHasACertificateError(courseId))
    }

    const certificate = Certificate.create({
      imageId: image.id,
      courseId: course.id
    })

    await this.certificatesRepository.create(certificate)

    return right({
      certificate
    })
  }
}
