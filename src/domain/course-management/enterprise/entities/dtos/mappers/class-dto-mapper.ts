import { type Class } from '../../class'
import { type ClassDTO } from '../class'

export class ClassDtoMapper {
  static toDTO(classToMap: Class): ClassDTO {
    return {
      id: classToMap.id,
      name: classToMap.name,
      description: classToMap.description,
      classNumber: classToMap.classNumber,
      moduleId: classToMap.moduleId,
      videoId: classToMap.videoId
    }
  }
}
