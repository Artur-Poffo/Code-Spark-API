import { type Course } from '../../course'
import { type CourseDTO } from '../course'

export class CourseDtoMapper {
  static toDTO(course: Course): CourseDTO {
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      createdAt: course.createdAt,
      bannerImageKey: course.bannerImageKey,
      coverImageKey: course.coverImageKey
    }
  }

  // May have toEntity method to return to the original entity format
}
