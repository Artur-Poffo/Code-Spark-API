import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Student } from '@/domain/course-management/enterprise/entities/student'
import { prisma } from '..'
import { EnrollmentMapper } from '../mappers/enrollment-mapeer'

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  // TODO: Continue

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id
      }
    })

    if (!enrollment) {
      return null
    }

    const domainEnrollment = EnrollmentMapper.toDomain(enrollment)

    return domainEnrollment
  }

  async findByStudentIdAndCourseId(studentId: string, courseId: string): Promise<Enrollment | null> {

  }

  async findManyByCourseId(courseId: string): Promise<Enrollment[]> {

  }

  async findManyByStudentId(studentId: string): Promise<Enrollment[]> {

  }

  async findManyStudentsByCourseId(courseId: string): Promise<Student[]> {

  }

  async markClassAsCompleted(classId: string, enrollment: Enrollment): Promise<Enrollment | null> {

  }

  async markModuleAsCompleted(moduleId: string, enrollment: Enrollment): Promise<Enrollment | null> {

  }

  async markAsCompleted(enrollment: Enrollment): Promise<Enrollment> {

  }

  async countEnrollmentsByYear(year: number): Promise<number> {

  }

  async create(enrollment: Enrollment): Promise<Enrollment> {

  }

  async save(enrollment: Enrollment): Promise<void> {

  }

  async delete(enrollment: Enrollment): Promise<void> {

  }
}
