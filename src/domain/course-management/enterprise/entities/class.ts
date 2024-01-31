import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassProps {
  name: string
  description: string
  classVideoId: UniqueEntityID
  classNumber: number
  moduleId: UniqueEntityID
}

export class Class extends Entity<ClassProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get classVideoId() {
    return this.props.classVideoId
  }

  get classNumber() {
    return this.props.classNumber
  }

  get moduleId() {
    return this.props.moduleId
  }

  static create(
    props: ClassProps,
    id?: UniqueEntityID
  ) {
    const courseClass = new Class(
      {
        ...props
      },
      id
    )

    return courseClass
  }
}
