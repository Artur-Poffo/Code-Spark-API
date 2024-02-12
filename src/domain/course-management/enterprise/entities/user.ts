import { Entity } from '@/core/entities/entity'

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

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get age() {
    return this.props.age
  }

  set age(age: number) {
    this.props.age = age
  }

  get cpf() {
    return this.props.cpf
  }

  get summary() {
    return this.props.summary
  }

  set summary(summary: string) {
    this.props.summary = summary
  }

  get profileImageKey() {
    return this.props.profileImageKey
  }

  set profileImageKey(profileImageKey: string | undefined | null) {
    this.props.profileImageKey = profileImageKey
  }

  get bannerImageKey() {
    return this.props.bannerImageKey
  }

  set bannerImageKey(bannerImageKey: string | undefined | null) {
    this.props.bannerImageKey = bannerImageKey
  }

  get registeredAt() {
    return this.props.registeredAt
  }
}
