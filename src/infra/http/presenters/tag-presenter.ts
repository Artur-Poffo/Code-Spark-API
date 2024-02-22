import { type Prisma } from '@prisma/client'

export class TagPresenter {
  static toHTTP(tag: Prisma.TagUncheckedCreateInput) {
    return {
      id: tag.id,
      value: tag.value,
      addedAt: tag.addedAt
    }
  }
}
