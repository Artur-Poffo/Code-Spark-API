import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type EvaluationsRepository } from '@/domain/course-management/application/repositories/evaluations-repository'
import { type StudentCertificatesRepository } from '@/domain/course-management/application/repositories/student-certificates-repository'
import { Student } from '@/domain/course-management/enterprise/entities/student'
import { type Prisma, type User as PrismaUser } from '@prisma/client'

export class StudentMapper {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly studentCertificatesRepository: StudentCertificatesRepository
  ) {}

  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
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
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(student: Student): Promise<Prisma.UserUncheckedCreateInput> {
    const studentEnrollments = await this.enrollmentsRepository.findManyByStudentId(student.id.toString())
    const studentEvaluations = await this.evaluationsRepository.findManyByStudentId(student.id.toString())
    const studentCertificates = await this.studentCertificatesRepository.findManyByStudentId(student.id.toString())

    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      passwordHash: student.passwordHash,
      role: 'STUDENT',
      age: student.age,
      cpf: student.cpf,
      summary: student.summary,
      bannerImageKey: student.bannerImageKey,
      profileImageKey: student.profileImageKey,
      registeredAt: student.registeredAt,
      enrollments: {
        connect: studentEnrollments.map(enrollment => ({ id: enrollment.id.toString() }))
      },
      evaluations: {
        connect: studentEvaluations.map(evaluation => ({ id: evaluation.id.toString() }))
      },
      studentCertificates: {
        connect: studentCertificates.map(studentCertificate => ({ id: studentCertificate.id.toString() }))
      }
    }
  }
}
