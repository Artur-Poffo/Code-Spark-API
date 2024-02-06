import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CourseWithStudentsDTO } from '../../enterprise/entities/dtos/course-with-students'
import { type Student } from '../../enterprise/entities/student'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments'
import { type StudentsRepository } from '../repositories/students-repository'

interface GetCourseWithStudentsUseCaseRequest {
  courseId: string
}

type GetCourseWithStudentsUseCaseResponse = Either<
ResourceNotFoundError,
{
  courseWithStudents: CourseWithStudentsDTO
}
>

export class GetCourseWithStudentsUseCase implements UseCase<GetCourseWithStudentsUseCaseRequest, GetCourseWithStudentsUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    courseId
  }: GetCourseWithStudentsUseCaseRequest): Promise<GetCourseWithStudentsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const enrollments = await this.enrollmentsRepository.findManyByCourseId(courseId)
    const registeredStudents = await Promise.all(enrollments.map(async (enrollmentToMap) => await this.studentsRepository.findById(enrollmentToMap.studentId.toString())))

    const nonNullRegisteredStudents: Student[] = registeredStudents.filter(studentToFilter => studentToFilter !== null) as Student[]

    const courseWithTheirStudents: CourseWithStudentsDTO = {
      course: {
        id: course.id,
        name: course.name,
        description: course.description,
        coverImageKey: course.coverImageKey,
        bannerImageKey: course.bannerImageKey,
        createdAt: course.createdAt
      },
      students: nonNullRegisteredStudents.length > 0 ? nonNullRegisteredStudents : []
    }

    return right({
      courseWithStudents: courseWithTheirStudents
    })
  }
}
