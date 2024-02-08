import { type Course } from '../../enterprise/entities/course'
import { type CompleteCourseDTO } from '../../enterprise/entities/dtos/complete-course'
import { type CourseWithModulesDTO } from '../../enterprise/entities/dtos/course-with-modules'
import { type CourseWithStudentsDTO } from '../../enterprise/entities/dtos/course-with-students'
import { type InstructorWithCoursesDTO } from '../../enterprise/entities/dtos/instructor-with-courses'
import { type StudentWithCoursesDTO } from './../../enterprise/entities/dtos/student-with-courses'

export interface CoursesRepository {
  findById: (id: string) => Promise<Course | null>
  findManyByInstructorId: (instructorId: string) => Promise<Course[]>
  findCourseWithStudentsById: (id: string) => Promise<CourseWithStudentsDTO | null>
  findCourseWithSModulesById: (id: string) => Promise<CourseWithModulesDTO | null>
  findCompleteCourseEntityById: (id: string) => Promise<CompleteCourseDTO | null>
  findInstructorWithCoursesByInstructorId: (instructorId: string) => Promise<InstructorWithCoursesDTO | null>
  findStudentWithCoursesByStudentId: (studentId: string) => Promise<StudentWithCoursesDTO | null>
  create: (course: Course) => Promise<Course>
}
