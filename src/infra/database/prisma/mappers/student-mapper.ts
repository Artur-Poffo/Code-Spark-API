import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/course-management/enterprise/entities/student'
import { type Prisma, type User as PrismaUser } from '@prisma/client'

export class StudentMapper {
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

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
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
      registeredAt: student.registeredAt
    }
  }
}
