import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface ModuleProps {
  id: UniqueEntityID
  name: string
  description: string
  courseId: UniqueEntityID
}

export class Module extends Entity<ModuleProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get courseId() {
    return this.props.courseId
  }

  static create(
    props: ModuleProps,
    id?: UniqueEntityID,
  ) {
    const module = new Module(
      {
        ...props,
      },
      id,
    )

    return module
  }
}