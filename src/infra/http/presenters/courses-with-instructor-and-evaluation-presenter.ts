import { type CourseWithInstructorAndEvaluationDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-instructor-and-evaluation'

export class CoursesWithInstructorAndEvaluationPresenter {
  static toHTTP(courseWithInstructorAndEvaluation: CourseWithInstructorAndEvaluationDTO) {
    return {
      course: {
        id: courseWithInstructorAndEvaluation.course.id.toString(),
        name: courseWithInstructorAndEvaluation.course.name,
        description: courseWithInstructorAndEvaluation.course.description,
        coverImageKey: courseWithInstructorAndEvaluation.course.coverImageKey,
        bannerImageKey: courseWithInstructorAndEvaluation.course.bannerImageKey,
        createdAt: courseWithInstructorAndEvaluation.course.createdAt
      },
      instructor: {
        id: courseWithInstructorAndEvaluation.instructor.id.toString(),
        name: courseWithInstructorAndEvaluation.instructor.name,
        email: courseWithInstructorAndEvaluation.instructor.email,
        age: courseWithInstructorAndEvaluation.instructor.age,
        summary: courseWithInstructorAndEvaluation.instructor.summary,
        profileImageKey: courseWithInstructorAndEvaluation.instructor.profileImageKey,
        bannerImageKey: courseWithInstructorAndEvaluation.instructor.bannerImageKey,
        registeredAt: courseWithInstructorAndEvaluation.instructor.registeredAt
      },
      evaluationsAverage: courseWithInstructorAndEvaluation.evaluationsAverage
    }
  }
}
