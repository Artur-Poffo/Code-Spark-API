import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { User, UserProps } from "./user";

export interface InstructorProps extends UserProps {
  instructorId: UniqueEntityID
}

export class Instructor extends User<InstructorProps> {
  get instructorId() {
    return this.props.instructorId
  }

  static create(
    props: Optional<InstructorProps, 'registeredAt' | 'profileImageKey' | 'bannerImageKey'>,
    id?: UniqueEntityID,
  ) {
    const instructor = new Instructor(
      {
        ...props,
        profileImageKey: null,
        bannerImageKey: null,
        registeredAt: props.registeredAt ?? new Date()
      },
      id,
    )

    return instructor
  }
}