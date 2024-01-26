import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassProps {
  name: string
  description: string
  duration: number
  videoKey: string
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

  get duration() {
    return this.props.duration
  }

  get videoKey() {
    return this.props.videoKey
  }

  get classNumber() {
    return this.props.classNumber
  }

  get moduleKey() {
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
