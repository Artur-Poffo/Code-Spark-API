import { type Prisma } from '@prisma/client'

export class ModulePresenter {
  static toHTTP(module: Prisma.ModuleUncheckedCreateInput) {
    return {
      id: module.id,
      name: module.name,
      description: module.description,
      moduleNumber: module.moduleNumber,
      courseId: module.courseId
    }
  }
}
