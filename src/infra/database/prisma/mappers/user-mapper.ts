import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type EvaluationsRepository } from '@/domain/course-management/application/repositories/evaluations-repository'
import { type StudentCertificatesRepository } from '@/domain/course-management/application/repositories/student-certificates-repository'
import { type Course } from '@/domain/course-management/enterprise/entities/course'
import { type Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Evaluation } from '@/domain/course-management/enterprise/entities/evaluation'
import { Instructor, type InstructorProps } from '@/domain/course-management/enterprise/entities/instructor'
import { Student, type StudentProps } from '@/domain/course-management/enterprise/entities/student'
import { type StudentCertificate } from '@/domain/course-management/enterprise/entities/student-certificate'
import { type User } from '@/domain/course-management/enterprise/entities/user'
import { type Prisma, type User as PrismaUser } from '@prisma/client'

export class UserMapper {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly studentCertificatesRepository: StudentCertificatesRepository
  ) {}

  static toDomain(raw: PrismaUser): User<StudentProps | InstructorProps> {
    if (raw.role === 'INSTRUCTOR') {
      return Instructor.create({
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        age: raw.age,
        cpf: raw.cpf,
        summary: raw.summary,
        bannerImageKey: raw.bannerImageKey,
        profileImageKey: raw.profileImageKey,
        registeredAt: raw.registeredAt
      },
      new UniqueEntityID(raw.id))
    }

    return Student.create({
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      age: raw.age,
      cpf: raw.cpf,
      summary: raw.summary,
      bannerImageKey: raw.bannerImageKey,
      profileImageKey: raw.profileImageKey,
      registeredAt: raw.registeredAt
    },
    new UniqueEntityID(raw.id))
  }

  async toPrisma(user: User<StudentProps | InstructorProps>): Promise<Prisma.UserUncheckedCreateInput> {
    let role: 'STUDENT' | 'INSTRUCTOR' = 'STUDENT'

    let instructorCourses: Course[] | undefined
    let studentEnrollments: Enrollment[] | undefined
    let studentEvaluations: Evaluation[] | undefined
    let studentCertificates: StudentCertificate[] | undefined

    if (user instanceof Student) {
      role = 'STUDENT'

      studentEnrollments = await this.enrollmentsRepository.findManyByStudentId(user.id.toString())
      studentEvaluations = await this.evaluationsRepository.findManyByStudentId(user.id.toString())
      studentCertificates = await this.studentCertificatesRepository.findManyByStudentId(user.id.toString())
    } else {
      role = 'INSTRUCTOR'

      instructorCourses = await this.coursesRepository.findManyByInstructorId(user.id.toString())
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role,
      age: user.age,
      cpf: user.cpf,
      summary: user.summary,
      bannerImageKey: user.bannerImageKey,
      profileImageKey: user.profileImageKey,
      registeredAt: user.registeredAt,
      courses: {
        connect: instructorCourses ? instructorCourses.map(course => ({ id: course.id.toString() })) : undefined
      },
      enrollments: {
        connect: studentEnrollments ? studentEnrollments.map(enrollment => ({ id: enrollment.id.toString() })) : undefined
      },
      evaluations: {
        connect: studentEvaluations ? studentEvaluations.map(evaluation => ({ id: evaluation.id.toString() })) : undefined
      },
      studentCertificates: {
        connect: studentCertificates ? studentCertificates.map(studentCertificate => ({ id: studentCertificate.id.toString() })) : undefined
      }
    }
  }
}
