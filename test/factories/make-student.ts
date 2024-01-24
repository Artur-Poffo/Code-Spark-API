import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, type StudentProps } from '@/domain/course-management/enterprise/entities/student'
import { faker } from '@faker-js/faker'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      age: 20,
      cpf: '111.111.111-11',
      summary: faker.person.bio(),
      ...override
    },
    id
  )

  return student
}
