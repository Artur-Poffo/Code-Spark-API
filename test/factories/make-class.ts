import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Class, type ClassProps } from '@/domain/course-management/enterprise/entities/class'
import { faker } from '@faker-js/faker'

export function makeClass(
  override: Partial<ClassProps> = {},
  id?: UniqueEntityID
) {
  const classToMake = Class.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      classNumber: faker.number.int(),
      classVideoId: override.classVideoId ?? new UniqueEntityID(),
      moduleId: override.moduleId ?? new UniqueEntityID(),
      ...override
    },
    id
  )

  return classToMake
}
