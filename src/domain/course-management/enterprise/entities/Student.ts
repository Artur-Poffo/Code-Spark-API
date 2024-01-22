import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { User, UserProps } from "./user";

export interface StudentProps extends UserProps {
  studentId: UniqueEntityID
}

export class Student extends User<StudentProps> {
  get studentId() {
    return this.props.studentId
  }

  static create(
    props: Optional<StudentProps, 'registeredAt' | 'profileImageKey' | 'bannerImageKey'>,
    id?: UniqueEntityID,
  ) {
    const student = new Student(
      {
        ...props,
        profileImageKey: null,
        bannerImageKey: null,
        registeredAt: props.registeredAt ?? new Date()
      },
      id,
    )

    return student
  }
}