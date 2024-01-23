import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Instructor, type InstructorProps } from '@/domain/course-management/enterprise/entities/instructor'
import { faker } from '@faker-js/faker'

export function makeInstructor(
  override: Partial<InstructorProps> = {},
  id?: UniqueEntityID
) {
  const instructor = Instructor.create(
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

  return instructor
}
