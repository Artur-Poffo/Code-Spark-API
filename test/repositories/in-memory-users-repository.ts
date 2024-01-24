import { type UsersRepository } from '@/domain/course-management/application/repositories/users-repository'
import { type InstructorProps } from '@/domain/course-management/enterprise/entities/instructor'
import { Student, type StudentProps } from '@/domain/course-management/enterprise/entities/student'
import { type User } from '@/domain/course-management/enterprise/entities/user'
import { type InMemoryInstructorRepository } from './in-memory-instructors-repository'
import { type InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: Array<User<StudentProps | InstructorProps>> = []

  constructor(
    private readonly inMemoryInstructorsRepository: InMemoryInstructorRepository,
    private readonly inMemoryStudentsRepository: InMemoryStudentsRepository
  ) {}

  async findByEmail(email: string): Promise<User<StudentProps | InstructorProps> | null> {
    const user = this.items.find(userToCompare => userToCompare.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User<StudentProps | InstructorProps>): Promise<User<StudentProps | InstructorProps>> {
    this.items.push(user)

    if (user instanceof Student) {
      this.inMemoryStudentsRepository.items.push(user)
      return user
    }

    this.inMemoryInstructorsRepository.items.push(user)
    return user
  }
}
