import { type InstructorProps } from '../../enterprise/entities/instructor'
import { type StudentProps } from '../../enterprise/entities/student'
import { type User } from '../../enterprise/entities/user'

export interface UsersRepository {
  findById: (id: string) => Promise<User<StudentProps | InstructorProps> | null>
  findByEmail: (email: string) => Promise<User<StudentProps | InstructorProps> | null>
  create: (user: User<StudentProps | InstructorProps>) => Promise<User<StudentProps | InstructorProps>>
}
