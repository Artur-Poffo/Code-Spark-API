import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Student } from '@/domain/course-management/enterprise/entities/student'
import { prisma } from '..'
import { StudentMapper } from '../mappers/student-mapper'
import { type EnrollmentMapper } from './../mappers/enrollment-mapeer'

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  constructor(
    private readonly enrollmentMapper: EnrollmentMapper
  ) {}

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id
      }
    })

    if (!enrollment) {
      return null
    }

    const domainEnrollment = await this.enrollmentMapper.toDomain(enrollment)

    return domainEnrollment
  }

  async findByStudentIdAndCourseId(studentId: string, courseId: string): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId,
        userId: studentId
      }
    })

    if (!enrollment) {
      return null
    }

    const domainEnrollment = await this.enrollmentMapper.toDomain(enrollment)

    return domainEnrollment
  }

  async findManyByCourseId(courseId: string): Promise<Enrollment[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId
      },
      orderBy: {
        ocurredAt: 'desc'
      }
    })

    const domainEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => await this.enrollmentMapper.toDomain(enrollment))
        .filter(enrollment => enrollment !== null) as unknown as Enrollment[]
    )

    return domainEnrollments
  }

  async findManyByStudentId(studentId: string): Promise<Enrollment[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: studentId
      },
      orderBy: {
        ocurredAt: 'desc'
      }
    })

    const domainEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => await this.enrollmentMapper.toDomain(enrollment))
        .filter(enrollment => enrollment !== null) as unknown as Enrollment[]
    )

    return domainEnrollments
  }

  async findManyStudentsByCourseId(courseId: string): Promise<Student[]> {
    const students = await prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            courseId
          }
        }
      }
    })

    return students.map(student => StudentMapper.toDomain(student))
  }

  async markClassAsCompleted(classId: string, enrollment: Enrollment): Promise<Enrollment | null> {
    const infraEnrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollment.id.toString()
      }
    })

    if (!infraEnrollment) {
      return null
    }

    const classToMarkAsCompleted = await prisma.class.findUnique({
      where: {
        id: classId
      }
    })

    if (!classToMarkAsCompleted) {
      return null
    }

    await prisma.enrollmentCompletedItem.create({
      data: {
        itemId: classId,
        itemType: 'CLASS',
        enrollmentId: infraEnrollment.id
      }
    })

    const domainEnrollment = await this.enrollmentMapper.toDomain(infraEnrollment)

    return domainEnrollment
  }

  async markModuleAsCompleted(moduleId: string, enrollment: Enrollment): Promise<Enrollment | null> {
    const infraEnrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollment.id.toString()
      }
    })

    if (!infraEnrollment) {
      return null
    }

    const module = await prisma.class.findUnique({
      where: {
        id: moduleId
      }
    })

    if (!module) {
      return null
    }

    await prisma.enrollmentCompletedItem.create({
      data: {
        itemId: moduleId,
        itemType: 'MODULE',
        enrollmentId: infraEnrollment.id
      }
    })

    const domainEnrollment = await this.enrollmentMapper.toDomain(infraEnrollment)

    return domainEnrollment
  }

  async markAsCompleted(enrollment: Enrollment): Promise<Enrollment | null> {
    const infraEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollment.id.toString()
      },
      data: {
        completedAt: new Date()
      }
    })

    const domainEnrollment = await this.enrollmentMapper.toDomain(infraEnrollment)

    return domainEnrollment
  }

  async countEnrollmentsByYear(year: number): Promise<number> {
    return await prisma.enrollment.count({
      where: {
        ocurredAt: new Date(year)
      }
    })
  }

  async create(enrollment: Enrollment): Promise<Enrollment | null> {
    const infraEnrollment = await this.enrollmentMapper.toPrisma(enrollment)

    if (!infraEnrollment) {
      return null
    }

    await prisma.enrollment.create({
      data: infraEnrollment
    })

    return enrollment
  }

  async save(enrollment: Enrollment): Promise<void> {
    const infraEnrollment = await this.enrollmentMapper.toPrisma(enrollment)

    if (!infraEnrollment) {
      return
    }

    await prisma.enrollment.update({
      where: {
        id: infraEnrollment.id
      },
      data: infraEnrollment
    })
  }

  async delete(enrollment: Enrollment): Promise<void> {
    await prisma.enrollment.delete({
      where: {
        id: enrollment.id.toString()
      }
    })
  }
}
