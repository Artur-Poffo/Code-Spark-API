import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CourseDTO {
  id: UniqueEntityID
  name: string
  description: string
  coverImageKey?: string | null
  bannerImageKey?: string | null
  createdAt: Date
}
