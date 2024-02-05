import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudentDTO {
  id: UniqueEntityID
  name: string
  email: string
  age: number
  summary: string
  profileImageKey?: string | null
  bannerImageKey?: string | null
  registeredAt: Date
}
