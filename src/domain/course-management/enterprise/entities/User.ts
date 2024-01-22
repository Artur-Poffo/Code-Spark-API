import { Entity } from "@/core/entities/entity"

export interface UserProps {
  name: string
  email: string
  passwordHash: string
  age: number
  cpf: string
  summary: string
  profileImageKey?: string | null
  bannerImageKey?: string | null
  registeredAt: Date
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get age() {
    return this.props.age
  }

  get cpf() {
    return this.props.cpf
  }

  get summary() {
    return this.props.summary
  }

  get profileImageKey() {
    return this.props.profileImageKey
  }

  get bannerImageKey() {
    return this.props.bannerImageKey
  }

  get registeredAt() {
    return this.props.registeredAt
  }
}