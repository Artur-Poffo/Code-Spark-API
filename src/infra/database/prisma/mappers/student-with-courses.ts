import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type StudentWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/student-with-courses'
import { type Course, type Enrollment, type User } from '@prisma/client'
import { CourseMapper } from './course-mapper'

type PrismaStudentWithCourses = User & {
  enrollments: Array<Enrollment & {
    course: Course
  }>
}

export class studentWithCoursesMapper {
  static toDomain(raw: PrismaStudentWithCourses): StudentWithCoursesDTO {
    const domainCourses = raw.enrollments.map(enrollment => CourseMapper.toDomain(enrollment.course))

    const studentWithCourses: StudentWithCoursesDTO = {
      student: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        age: raw.age,
        email: raw.email,
        summary: raw.summary,
        bannerImageKey: raw.bannerImageKey,
        profileImageKey: raw.profileImageKey,
        registeredAt: raw.registeredAt
      },
      courses: domainCourses
    }

    return studentWithCourses
  }
}
