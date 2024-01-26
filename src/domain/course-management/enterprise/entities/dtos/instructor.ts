export interface InstructorDTO {
  name: string
  email: string
  age: number
  summary: string
  profileImageKey?: string | null
  bannerImageKey?: string | null
  registeredAt: Date
}
