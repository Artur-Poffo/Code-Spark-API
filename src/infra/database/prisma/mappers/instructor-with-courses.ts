import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type InstructorWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/instructor-with-courses'
import { type Course, type User } from '@prisma/client'
import { CourseMapper } from './course-mapper'

type PrismaInstructorWithCourses = User & {
  courses: Course[]
}

export class instructorWithCoursesMapper {
  static toDomain(raw: PrismaInstructorWithCourses): InstructorWithCoursesDTO {
    const domainCourses = raw.courses.map(course => CourseMapper.toDomain(course))

    const instructorWithCourses: InstructorWithCoursesDTO = {
      instructor: {
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

    return instructorWithCourses
  }
}
