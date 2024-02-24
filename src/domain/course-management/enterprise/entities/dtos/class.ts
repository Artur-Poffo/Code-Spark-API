import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassDTO {
  id: UniqueEntityID
  name: string
  description: string
  videoId: UniqueEntityID
  classNumber: number
  moduleId: UniqueEntityID
}
