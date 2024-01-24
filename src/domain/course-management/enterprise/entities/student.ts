import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { User, type UserProps } from './user'

export interface StudentProps extends UserProps { }

export class Student extends User<StudentProps> {
  static create(
    props: Optional<StudentProps, 'registeredAt' | 'profileImageKey' | 'bannerImageKey'>,
    id?: UniqueEntityID
  ) {
    const student = new Student(
      {
        ...props,
        profileImageKey: null,
        bannerImageKey: null,
        registeredAt: props.registeredAt ?? new Date()
      },
      id
    )

    return student
  }
}
