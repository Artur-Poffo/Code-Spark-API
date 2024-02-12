import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassProps {
  name: string
  description: string
  videoId: UniqueEntityID
  classNumber: number
  moduleId: UniqueEntityID
}

export class Class extends Entity<ClassProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get videoId() {
    return this.props.videoId
  }

  set videoId(videoId: UniqueEntityID) {
    this.props.videoId = videoId
  }

  get classNumber() {
    return this.props.classNumber
  }

  set classNumber(classNumber: number) {
    this.props.classNumber = classNumber
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
