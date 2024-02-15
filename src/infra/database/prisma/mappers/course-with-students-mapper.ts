import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CourseWithStudentsDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-students'
import { type Course, type Enrollment, type User } from '@prisma/client'
import { StudentMapper } from './student-mapper'

type PrismaCourseWithStudents = Course & {
  enrollments: Array<Enrollment & {
    user: User
  }>
}

export class courseWithStudentsMapper {
  static toDomain(raw: PrismaCourseWithStudents): CourseWithStudentsDTO {
    const students = raw.enrollments.map(enrollment => enrollment.user)

    const domainStudents = students.map(student => StudentMapper.toDomain(student))

    const courseWithStudents: CourseWithStudentsDTO = {
      course: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        description: raw.description,
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      students: domainStudents
    }

    return courseWithStudents
  }
}
