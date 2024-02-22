import { type Prisma } from '@prisma/client'

export class ClassPresenter {
  static toHTTP(classToPresent: Prisma.ClassUncheckedCreateInput) {
    return {
      id: classToPresent.id,
      name: classToPresent.name,
      description: classToPresent.description,
      classNumber: classToPresent.classNumber,
      moduleId: classToPresent.moduleId,
      videoId: classToPresent.videoId
    }
  }
}
