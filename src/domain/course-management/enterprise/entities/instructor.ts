import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { User, type UserProps } from './user'

export interface InstructorProps extends UserProps { }

export class Instructor extends User<InstructorProps> {
  static create(
    props: Optional<InstructorProps, 'registeredAt' | 'profileImageKey' | 'bannerImageKey'>,
    id?: UniqueEntityID
  ) {
    const instructor = new Instructor(
      {
        ...props,
        registeredAt: props.registeredAt ?? new Date()
      },
      id
    )

    return instructor
  }
}
