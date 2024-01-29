import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Module, type ModuleProps } from '@/domain/course-management/enterprise/entities/module'
import { faker } from '@faker-js/faker'

export function makeModule(
  override: Partial<ModuleProps> = {},
  id?: UniqueEntityID
) {
  const module = Module.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      moduleNumber: faker.number.int(),
      courseId: override.courseId ?? new UniqueEntityID(),
      ...override
    },
    id
  )

  return module
}
