import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Enrollment } from '../../enterprise/entities/enrollment'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { AlreadyEnrolledInThisCourse } from './errors/already-enrolled-in-this-course'

interface EnrollToCourseUseCaseRequest {
  studentId: string
  courseId: string
}

type EnrollToCourseUseCaseResponse = Either<
ResourceNotFoundError | AlreadyEnrolledInThisCourse,
{
  enrollment: Enrollment
}
>

export class EnrollToCourseUseCase implements UseCase<EnrollToCourseUseCaseRequest, EnrollToCourseUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    studentId,
    courseId
  }: EnrollToCourseUseCaseRequest): Promise<EnrollToCourseUseCaseResponse> {
    const [student, course] = await Promise.all([
      this.studentsRepository.findById(studentId),
      this.coursesRepository.findById(courseId)
    ])

    if (!student || !course) {
      return left(new ResourceNotFoundError())
    }

    const enrollmentAlreadyExists = await this.enrollmentsRepository.findByStudentIdAndCourseId(studentId, courseId)

    if (enrollmentAlreadyExists) {
      return left(new AlreadyEnrolledInThisCourse(course.name))
    }

    const enrollment = Enrollment.create({
      studentId: student.id,
      courseId: course.id
    })

    await this.enrollmentsRepository.create(enrollment)

    return right({
      enrollment
    })
  }
}
