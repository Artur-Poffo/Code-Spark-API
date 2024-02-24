import { type Prisma } from '@prisma/client'

export class CoursePresenter {
  static toHTTP(course: Prisma.CourseUncheckedCreateInput) {
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      coverImageKey: course.coverImageKey,
      bannerImageKey: course.bannerImageKey,
      createdAt: course.createdAt,
      instructorId: course.instructorId
    }
  }
}
