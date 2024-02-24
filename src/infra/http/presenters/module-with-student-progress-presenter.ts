import { type ModuleWithStudentProgressDTO } from '@/domain/course-management/enterprise/entities/dtos/module-with-student-progress'

export class ModuleWithStudentProgressPresenter {
  static toHTTP(moduleWithStudentProgress: ModuleWithStudentProgressDTO) {
    return {
      id: moduleWithStudentProgress.module.id.toString(),
      name: moduleWithStudentProgress.module.name,
      description: moduleWithStudentProgress.module.description,
      moduleNumber: moduleWithStudentProgress.module.moduleNumber,
      completed: moduleWithStudentProgress.completed,
      courseId: moduleWithStudentProgress.module.courseId.toString()
    }
  }
}
