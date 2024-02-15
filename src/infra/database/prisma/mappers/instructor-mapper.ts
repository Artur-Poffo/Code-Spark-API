import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Instructor } from '@/domain/course-management/enterprise/entities/instructor'
import { type Prisma, type User as PrismaUser } from '@prisma/client'

export class InstructorMapper {
  static toDomain(raw: PrismaUser): Instructor {
    return Instructor.create(
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

  static toPrisma(instructor: Instructor): Prisma.UserUncheckedCreateInput {
    return {
      id: instructor.id.toString(),
      name: instructor.name,
      email: instructor.email,
      passwordHash: instructor.passwordHash,
      role: 'INSTRUCTOR',
      age: instructor.age,
      cpf: instructor.cpf,
      summary: instructor.summary,
      bannerImageKey: instructor.bannerImageKey,
      profileImageKey: instructor.profileImageKey,
      registeredAt: instructor.registeredAt
    }
  }
}
