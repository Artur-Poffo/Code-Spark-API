import { type Prisma } from '@prisma/client'

export class FilePresenter {
  static toHTTP(file: Prisma.FileUncheckedCreateInput) {
    return {
      id: file.id,
      fileKey: file.key
    }
  }
}
