import { type StudentsRepository } from '@/domain/course-management/application/repositories/students-repository'
import { type Student } from '@/domain/course-management/enterprise/entities/student'
import { prisma } from '..'
import { StudentMapper } from '../mappers/student-mapper'

export class PrismaStudentsRepository implements StudentsRepository {
  async findById(id: string): Promise<Student | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      return null
    }

    const student = StudentMapper.toDomain(user)

    return student
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return null
    }

    const student = StudentMapper.toDomain(user)

    return student
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    const user = await prisma.user.findUnique({
      where: {
        cpf
      }
    })

    if (!user) {
      return null
    }

    const student = StudentMapper.toDomain(user)

    return student
  }

  async create(student: Student): Promise<Student> {
    const user = StudentMapper.toPrisma(student)

    await prisma.user.create({
      data: user
    })

    return student
  }

  async save(student: Student): Promise<void> {
    const user = StudentMapper.toPrisma(student)

    await prisma.user.update({
      data: user,
      where: {
        id: user.id
      }
    })
  }
}
