import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ModuleDTO {
  name: string
  description: string
  moduleNumber: number
  courseId: UniqueEntityID
}
