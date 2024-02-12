import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Enrollment } from '../../enterprise/entities/enrollment'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'
import { type CoursesRepository } from './../repositories/courses-repository'

interface GetCourseMetricsUseCaseRequest {
  courseId: string
  instructorId: string
}

type GetCourseMetricsUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  enrolledStudentsNumber: number
  ageAverage: number
  growthPercentage: number
  growthPercentageFromLastYear: number
  completionPercentage: number
}
>

export class GetCourseMetricsUseCase implements UseCase< GetCourseMetricsUseCaseRequest, GetCourseMetricsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    courseId,
    instructorId
  }: GetCourseMetricsUseCaseRequest): Promise<GetCourseMetricsUseCaseResponse> {
    const [course, instructor] = await Promise.all([
      this.coursesRepository.findById(courseId),
      this.instructorsRepository.findById(instructorId)
    ])

    if (!course || !instructor) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheCourseOwner = instructor.id.equals(course.instructorId)

    if (!instructorIsTheCourseOwner) {
      return left(new NotAllowedError())
    }

    const courseStudents = await this.enrollmentsRepository.findManyStudentsByCourseId(courseId)

    let studentsAgeSum = 0
    let studentsAgeAverage = 0

    courseStudents.forEach(student => {
      studentsAgeSum += student.age
    })

    if (studentsAgeSum > 0) {
      studentsAgeAverage = studentsAgeSum / courseStudents.length
    }

    const studentsEnrollments: Enrollment[] = []

    await Promise.all(courseStudents.map(async student => {
      const enrollment = await this.enrollmentsRepository.findByStudentIdAndCourseId(student.id.toString(), courseId)

      if (enrollment) {
        studentsEnrollments.push(enrollment)
      }
    }))

    let sumOfCompletedEnrollments = 0
    let studentsCompletionPercentage = 0

    studentsEnrollments.forEach(enrollment => {
      if (enrollment.completedAt) {
        sumOfCompletedEnrollments += 1
      }
    })

    if (sumOfCompletedEnrollments > 0) {
      studentsCompletionPercentage = (sumOfCompletedEnrollments / studentsEnrollments.length) * 100
    }

    let growthPercentage = 0
    let growthPercentageFromLastYear = 0

    const currentYear = new Date().getFullYear()
    const referenceYear = course.createdAt.getFullYear()
    const lastYear = currentYear - 1

    const enrollmentsOnCurrentYear = await this.enrollmentsRepository.countEnrollmentsByYear(currentYear)
    const enrollmentsOnReferenceYear = await this.enrollmentsRepository.countEnrollmentsByYear(referenceYear)
    const enrollmentsOnLastYear = await this.enrollmentsRepository.countEnrollmentsByYear(lastYear)

    if (enrollmentsOnReferenceYear !== 0) {
      growthPercentage = ((enrollmentsOnCurrentYear - enrollmentsOnReferenceYear) / enrollmentsOnReferenceYear) * 100
    }

    if (enrollmentsOnLastYear !== 0) {
      growthPercentageFromLastYear = ((enrollmentsOnCurrentYear - enrollmentsOnLastYear) / enrollmentsOnLastYear) * 100
    }

    return right({
      enrolledStudentsNumber: courseStudents.length,
      ageAverage: studentsAgeAverage,
      growthPercentage,
      growthPercentageFromLastYear,
      completionPercentage: studentsCompletionPercentage
    })
  }
}
