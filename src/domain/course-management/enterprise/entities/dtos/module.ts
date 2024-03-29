import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ModuleDTO {
  id: UniqueEntityID
  name: string
  description: string
  moduleNumber: number
  courseId: UniqueEntityID
}
