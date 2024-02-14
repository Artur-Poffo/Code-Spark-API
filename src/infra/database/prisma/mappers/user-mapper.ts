import { Instructor, type InstructorProps } from '@/domain/course-management/enterprise/entities/instructor'
import { Student, type StudentProps } from '@/domain/course-management/enterprise/entities/student'
import { type User } from '@/domain/course-management/enterprise/entities/user'
import { type Prisma, type User as PrismaUser } from '@prisma/client'

export class UserMapper {
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
      })
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
    })
  }

  static toPrisma(user: User<StudentProps | InstructorProps>): Prisma.UserUncheckedCreateInput {
    let role: 'STUDENT' | 'INSTRUCTOR' = 'STUDENT'

    if (user instanceof Student) {
      role = 'STUDENT'
    } else {
      role = 'INSTRUCTOR'
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
      registeredAt: user.registeredAt
    }
  }
}
