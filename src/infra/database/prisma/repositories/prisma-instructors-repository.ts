import { type InstructorsRepository } from '@/domain/course-management/application/repositories/instructors-repository'
import { type Instructor } from '@/domain/course-management/enterprise/entities/instructor'
import { prisma } from '..'
import { InstructorMapper } from './../mappers/instructor-mapper'

export class PrismaInstructorsRepository implements InstructorsRepository {
  constructor(
    private readonly instructorMapper: InstructorMapper
  ) {}

  async findById(id: string): Promise<Instructor | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      return null
    }

    const instructor = InstructorMapper.toDomain(user)

    return instructor
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return null
    }

    const instructor = InstructorMapper.toDomain(user)

    return instructor
  }

  async findByCpf(cpf: string): Promise<Instructor | null> {
    const user = await prisma.user.findUnique({
      where: {
        cpf
      }
    })

    if (!user) {
      return null
    }

    const instructor = InstructorMapper.toDomain(user)

    return instructor
  }

  async create(instructor: Instructor): Promise<Instructor> {
    const user = await this.instructorMapper.toPrisma(instructor)

    await prisma.user.create({
      data: user
    })

    return instructor
  }

  async save(instructor: Instructor): Promise<void> {
    const user = await this.instructorMapper.toPrisma(instructor)

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: user
    })
  }
}
