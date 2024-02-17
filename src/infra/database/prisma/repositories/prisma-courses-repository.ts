import { type Course } from '@/domain/course-management/enterprise/entities/course'
import { type CompleteCourseDTO } from '@/domain/course-management/enterprise/entities/dtos/complete-course'
import { type CourseWithModulesDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-modules'
import { type InstructorWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/instructor-with-courses'
import { type StudentWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/student-with-courses'
import { type Tag } from '@/domain/course-management/enterprise/entities/tag'
import { prisma } from '..'
import { CompleteCourseMapper } from '../mappers/complete-course-mapper'
import { CourseWithModulesMapper } from '../mappers/course-with-modules-mapper'
import { courseWithStudentsMapper } from '../mappers/course-with-students-mapper'
import { instructorWithCoursesMapper } from '../mappers/instructor-with-courses'
import { studentWithCoursesMapper } from '../mappers/student-with-courses'
import { type CoursesRepository } from './../../../../domain/course-management/application/repositories/courses-repository'
import { type CourseWithStudentsDTO } from './../../../../domain/course-management/enterprise/entities/dtos/course-with-students'
import { CourseMapper } from './../mappers/course-mapper'

export class PrismaCoursesRepository implements CoursesRepository {
  constructor(
    private readonly courseMapper: CourseMapper
  ) {}

  async findById(id: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({
      where: {
        id
      }
    })

    if (!course) {
      return null
    }

    const courseDomain = CourseMapper.toDomain(course)

    return courseDomain
  }

  async findAll(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return courses.map(course => CourseMapper.toDomain(course))
  }

  async findManyByInstructorId(instructorId: string): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: {
        instructorId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return courses.map(course => CourseMapper.toDomain(course))
  }

  async queryByName(name: string): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: {
        name: {
          contains: name
        }
      }
    })

    return courses.map(course => CourseMapper.toDomain(course))
  }

  async queryByTags(tags: Tag[]): Promise<Course[]> {
    const tagIds = tags.map(tag => tag.id.toString())

    const courses = await prisma.course.findMany({
      where: {
        courseTags: {
          some: {
            tagId: {
              in: tagIds
            }
          }
        }
      }
    })

    return courses.map(course => CourseMapper.toDomain(course))
  }

  async findCourseWithStudentsById(id: string): Promise<CourseWithStudentsDTO | null> {
    const courseWithStudents = await prisma.course.findUnique({
      where: {
        id
      },
      include: {
        enrollments: {
          include: {
            student: true
          }
        }
      }
    })

    if (!courseWithStudents) {
      return null
    }

    const domainCourseWithStudents = courseWithStudentsMapper.toDomain(courseWithStudents)

    return domainCourseWithStudents
  }

  async findCourseWithModulesById(id: string): Promise<CourseWithModulesDTO | null> {
    const courseWithModules = await prisma.course.findUnique({
      where: {
        id
      },
      include: {
        modules: true
      }
    })

    if (!courseWithModules) {
      return null
    }

    const domainCourseWithModules = CourseWithModulesMapper.toDomain(courseWithModules)

    return domainCourseWithModules
  }

  async findCompleteCourseEntityById(id: string): Promise<CompleteCourseDTO | null> {
    const completeCourse = await prisma.course.findUnique({
      where: {
        id
      },
      include: {
        modules: {
          include: {
            classes: true
          }
        },
        instructor: true
      }
    })

    if (!completeCourse) {
      return null
    }

    const domainCompleteCourse = CompleteCourseMapper.toDomain(completeCourse)

    return domainCompleteCourse
  }

  async findInstructorWithCoursesByInstructorId(instructorId: string): Promise<InstructorWithCoursesDTO | null> {
    const instructorWithCourses = await prisma.user.findUnique({
      where: {
        id: instructorId
      },
      include: {
        courses: true
      }
    })

    if (!instructorWithCourses) {
      return null
    }

    const domainInstructorWithCourses = instructorWithCoursesMapper.toDomain(instructorWithCourses)

    return domainInstructorWithCourses
  }

  async findStudentWithCoursesByStudentId(studentId: string): Promise<StudentWithCoursesDTO | null> {
    const studentWithCourses = await prisma.user.findUnique({
      where: {
        id: studentId
      },
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      }
    })

    if (!studentWithCourses) {
      return null
    }

    const domainStudentWithCourses = studentWithCoursesMapper.toDomain(studentWithCourses)

    return domainStudentWithCourses
  }

  async create(course: Course): Promise<Course> {
    const infraCourse = await this.courseMapper.toPrisma(course)

    await prisma.course.create({
      data: infraCourse
    })

    return course
  }

  async save(course: Course): Promise<void> {
    const infraCourse = await this.courseMapper.toPrisma(course)

    await prisma.course.update({
      data: infraCourse,
      where: {
        id: infraCourse.id
      }
    })
  }

  async delete(course: Course): Promise<void> {
    await prisma.course.delete({
      where: {
        id: course.id.toString()
      }
    })
  }
}
