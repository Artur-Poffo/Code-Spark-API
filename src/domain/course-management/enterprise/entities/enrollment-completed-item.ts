import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface EnrollmentCompletedItemProps {
  enrollmentId: UniqueEntityID
  itemId: UniqueEntityID
  type: 'MODULE' | 'CLASS'
}

export class EnrollmentCompletedItem extends Entity<EnrollmentCompletedItemProps> {
  get enrollmentId() {
    return this.props.enrollmentId
  }

  get itemId() {
    return this.props.itemId
  }

  get type() {
    return this.props.type
  }

  static create(
    props: EnrollmentCompletedItemProps,
    id?: UniqueEntityID
  ) {
    const courseEnrollmentCompletedItem = new EnrollmentCompletedItem(
      {
        ...props
      },
      id
    )

    return courseEnrollmentCompletedItem
  }
}
