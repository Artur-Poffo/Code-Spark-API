import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Course, type CourseProps } from '@/domain/course-management/enterprise/entities/course'
import { faker } from '@faker-js/faker'

export function makeCourse(
  override: Partial<CourseProps> = {},
  id?: UniqueEntityID
) {
  const course = Course.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      instructorId: override.instructorId ?? new UniqueEntityID(),
      ...override
    },
    id
  )

  return course
}
