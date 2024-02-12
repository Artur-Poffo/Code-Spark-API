import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ModuleProps {
  name: string
  description: string
  moduleNumber: number
  courseId: UniqueEntityID
}

export class Module extends Entity<ModuleProps> {
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

  get moduleNumber() {
    return this.props.moduleNumber
  }

  set moduleNumber(moduleNumber: number) {
    this.props.moduleNumber = moduleNumber
  }

  get courseId() {
    return this.props.courseId
  }

  static create(
    props: ModuleProps,
    id?: UniqueEntityID
  ) {
    const module = new Module(
      {
        ...props
      },
      id
    )

    return module
  }
}
