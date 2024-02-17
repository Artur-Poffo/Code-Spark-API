import { type UsersRepository } from '@/domain/course-management/application/repositories/users-repository'
import { type InstructorProps } from '@/domain/course-management/enterprise/entities/instructor'
import { type StudentProps } from '@/domain/course-management/enterprise/entities/student'
import { type User } from '@/domain/course-management/enterprise/entities/user'
import { prisma } from '..'
import { UserMapper } from './../mappers/user-mapper'

export class PrismaUsersRepository implements UsersRepository {
  constructor(
    private readonly userMapper: UserMapper
  ) {}

  async findById(id: string): Promise<User<StudentProps | InstructorProps> | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      return null
    }

    const domainUser = UserMapper.toDomain(user)

    return domainUser
  }

  async findByEmail(email: string): Promise<User<StudentProps | InstructorProps> | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return null
    }

    const domainUser = UserMapper.toDomain(user)

    return domainUser
  }

  async create(user: User<StudentProps | InstructorProps>): Promise<User<StudentProps | InstructorProps>> {
    const prismaUser = await this.userMapper.toPrisma(user)

    await prisma.user.create({
      data: prismaUser
    })

    return user
  }

  async delete(user: User<StudentProps | InstructorProps>): Promise<void> {
    await prisma.user.delete({
      where: {
        id: user.id.toString()
      }
    })
  }
}
