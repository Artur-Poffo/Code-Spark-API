import { type ClassWithStudentProgressDTO } from '@/domain/course-management/enterprise/entities/dtos/class-with-student-progress'

export class ClassWithStudentProgressPresenter {
  static toHTTP(classWithStudentProgress: ClassWithStudentProgressDTO) {
    return {
      id: classWithStudentProgress.class.id.toString(),
      name: classWithStudentProgress.class.name,
      description: classWithStudentProgress.class.description,
      classNumber: classWithStudentProgress.class.classNumber,
      completed: classWithStudentProgress.completed,
      moduleId: classWithStudentProgress.class.moduleId.toString(),
      videoId: classWithStudentProgress.class.videoId.toString()
    }
  }
}
