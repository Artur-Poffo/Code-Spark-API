import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { type CourseTag } from '@/domain/course-management/enterprise/entities/course-tag'
import { type CompleteCourseDTO } from '@/domain/course-management/enterprise/entities/dtos/complete-course'
import { type CourseWithModulesDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-modules'
import { type CourseWithStudentsDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-students'
import { type InstructorWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/instructor-with-courses'
import { type StudentWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/student-with-courses'
import { type Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Student } from '@/domain/course-management/enterprise/entities/student'
import { type Tag } from '@/domain/course-management/enterprise/entities/tag'
import { type Course } from './../../src/domain/course-management/enterprise/entities/course'
import { type ModuleWithClassesDTO } from './../../src/domain/course-management/enterprise/entities/dtos/module-with-classes'
import { type InMemoryCourseTagsRepository } from './in-memory-course-tags-repository'
import { type InMemoryEnrollmentsRepository } from './in-memory-enrollments-repository'
import { type InMemoryInstructorRepository } from './in-memory-instructors-repository'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'
import { type InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
  public items: Course[] = []

  constructor(
    private readonly inMemoryModulesRepository: InMemoryModulesRepository,
    private readonly inMemoryInstructorRepository: InMemoryInstructorRepository,
    private readonly inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository,
    private readonly inMemoryStudentsRepository: InMemoryStudentsRepository,
    private readonly inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
  ) {}

  async findById(id: string): Promise<Course | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    return course
  }

  async findManyByInstructorId(instructorId: string): Promise<Course[]> {
    return this.items.filter(courseToCompare => courseToCompare.instructorId.toString() === instructorId)
  }

  async queryByName(name: string): Promise<Course[]> {
    return this.items.filter(courseToCompare => courseToCompare.name.toUpperCase().includes(name.toUpperCase()))
  }

  async queryByTags(tags: Tag[]): Promise<Course[]> {
    const tagIds = tags.map(tagToMap => tagToMap.id)

    const courseTags: CourseTag[] = []

    await Promise.all(
      tagIds.map(async tagId => {
        const tagsForCurrentId = await this.inMemoryCourseTagsRepository.findManyByTagId(tagId.toString())
        courseTags.push(...tagsForCurrentId)
      })
    )

    const coursesSet = new Set<Course>()

    courseTags.forEach(courseTag => {
      const course = this.items.find(courseToFind => courseToFind.id.equals(courseTag.courseId))

      if (course) {
        coursesSet.add(course)
      }
    })

    const courses: Course[] = Array.from(coursesSet)

    return courses
  }

  async findCourseWithStudentsById(id: string): Promise<CourseWithStudentsDTO | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    const courseEnrollments = await this.inMemoryEnrollmentsRepository.findManyByCourseId(course.id.toString())
    const registeredStudents = await Promise.all(courseEnrollments.map(async (enrollmentToMap) => await this.inMemoryStudentsRepository.findById(enrollmentToMap.studentId.toString())))

    const nonNullRegisteredStudents: Student[] = registeredStudents.filter(studentToFilter => studentToFilter !== null) as Student[]

    const courseWithStudents: CourseWithStudentsDTO = {
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

    return courseWithStudents
  }

  async findCourseWithModulesById(id: string): Promise<CourseWithModulesDTO | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    const courseModules = await this.inMemoryModulesRepository.findManyByCourseId(course.id.toString())

    const courseWithModules: CourseWithModulesDTO = {
      course: {
        id: course.id,
        name: course.name,
        description: course.description,
        coverImageKey: course.coverImageKey,
        bannerImageKey: course.bannerImageKey,
        createdAt: course.createdAt
      },
      modules: courseModules
    }

    return courseWithModules
  }

  async findCompleteCourseEntityById(id: string): Promise<CompleteCourseDTO | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    const instructor = await this.inMemoryInstructorRepository.findById(course.instructorId.toString())

    if (!instructor) {
      return null
    }

    const courseModules = await this.inMemoryModulesRepository.findManyByCourseId(course.id.toString())
    const courseModulesAndClasses = await Promise.all(courseModules.map(async courseModule => await this.inMemoryModulesRepository.findModuleWithClassesById(courseModule.id.toString())))

    const nonNullModulesAndClasses: ModuleWithClassesDTO[] = courseModulesAndClasses.filter(courseModuleToCompare => courseModuleToCompare !== null) as ModuleWithClassesDTO[]

    const completeCourse: CompleteCourseDTO = {
      course: {
        id: course.id,
        name: course.name,
        description: course.description,
        bannerImageKey: course.bannerImageKey,
        coverImageKey: course.coverImageKey,
        createdAt: course.createdAt
      },
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        summary: instructor.summary,
        age: instructor.age,
        registeredAt: instructor.registeredAt,
        profileImageKey: instructor.profileImageKey,
        bannerImageKey: instructor.bannerImageKey
      },
      modules: nonNullModulesAndClasses.length > 0 ? nonNullModulesAndClasses : []
    }

    return completeCourse
  }

  async findInstructorWithCoursesByInstructorId(instructorId: string): Promise<InstructorWithCoursesDTO | null> {
    const instructor = await this.inMemoryInstructorRepository.findById(instructorId)

    if (!instructor) {
      return null
    }

    const instructorCourses = this.items.filter(courseToCompare => courseToCompare.instructorId.toString() === instructorId)

    const instructorWithCourses: InstructorWithCoursesDTO = {
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        summary: instructor.summary,
        age: instructor.age,
        profileImageKey: instructor.profileImageKey,
        bannerImageKey: instructor.bannerImageKey,
        registeredAt: instructor.registeredAt
      },
      courses: instructorCourses
    }

    return instructorWithCourses
  }

  async findStudentWithCoursesByStudentId(studentId: string): Promise<StudentWithCoursesDTO | null> {
    const student = await this.inMemoryStudentsRepository.findById(studentId)

    if (!student) {
      return null
    }

    const studentEnrollments: Enrollment[] = await this.inMemoryEnrollmentsRepository.findManyByStudentId(studentId)

    const studentCourses = await Promise.all(studentEnrollments.map(async (studentEnrollmentToMap) => {
      return this.items.find(courseToCompare => studentEnrollmentToMap.courseId.toString() === courseToCompare.id.toString())
    }))

    const nonNullStudentCourses: Course[] = studentCourses.filter(courseToFilter => courseToFilter !== null) as Course[]

    const studentsWithCourses: StudentWithCoursesDTO = {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        summary: student.summary,
        age: student.age,
        profileImageKey: student.profileImageKey,
        bannerImageKey: student.bannerImageKey,
        registeredAt: student.registeredAt
      },
      courses: nonNullStudentCourses.length > 0 ? nonNullStudentCourses : []
    }

    return studentsWithCourses
  }

  async create(course: Course): Promise<Course> {
    this.items.push(course)
    return course
  }
}
