import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Instructor } from '@/domain/course-management/enterprise/entities/instructor'
import { type Prisma, type User as PrismaUser } from '@prisma/client'
import { type CoursesRepository } from './../../../../domain/course-management/application/repositories/courses-repository'

export class InstructorMapper {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) {}

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

  async toPrisma(instructor: Instructor): Promise<Prisma.UserUncheckedCreateInput> {
    const instructorCourses = await this.coursesRepository.findManyByInstructorId(instructor.id.toString())

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
      registeredAt: instructor.registeredAt,
      courses: {
        connect: instructorCourses.map(course => ({ id: course.id.toString() }))
      }
    }
  }
}
