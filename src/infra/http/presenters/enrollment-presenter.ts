import { type Prisma } from '@prisma/client'

export class EnrollmentPresenter {
  static toHTTP(enrollment: Prisma.EnrollmentUncheckedCreateInput) {
    return {
      id: enrollment.id,
      ocurredAt: enrollment.ocurredAt,
      completedAt: enrollment.completedAt,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId
    }
  }
}
