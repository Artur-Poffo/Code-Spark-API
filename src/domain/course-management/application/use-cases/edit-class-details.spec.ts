import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryVideosRepository } from './../../../../../test/repositories/in-memory-videos-repository'
import { EditClassDetailsUseCase } from './edit-class-details'
import { ClassNumberIsAlreadyInUseError } from './errors/class-number-is-already-in-use-error'

let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: EditClassDetailsUseCase

describe('Edit class details use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new EditClassDetailsUseCase(
      inMemoryClassesRepository,
      inMemoryVideosRepository
    )
  })

  it('should be able to edit class details with video', async () => {
    const course = makeCourse({ name: 'John Doe Course' })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const newVideo = makeVideo()
    await inMemoryVideosRepository.create(newVideo)

    const classToEdit = makeClass({
      name: 'John Doe Class',
      moduleId: module.id
    })
    await inMemoryClassesRepository.create(classToEdit)

    const result = await sut.exec({
      name: 'New Class Name',
      videoId: newVideo.id.toString(),
      classId: classToEdit.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      class: expect.objectContaining({
        name: 'New Class Name',
        videoId: newVideo.id
      })
    })
  })

  it('should not be able to edit class details of a inexistent class', async () => {
    const result = await sut.exec({
      classId: 'inexistentClassId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update video class if the new video not exists', async () => {
    const course = makeCourse({ name: 'John Doe Course' })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEdit = makeClass({
      name: 'John Doe Class',
      moduleId: module.id
    })
    await inMemoryClassesRepository.create(classToEdit)

    const result = await sut.exec({
      name: 'New Class Name',
      videoId: 'inexistentVideoId',
      classId: classToEdit.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update class number if the class number is already in use', async () => {
    const course = makeCourse({ name: 'John Doe Course' })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToConflict = makeClass({
      name: 'John Doe Class',
      moduleId: module.id,
      classNumber: 1
    })
    const classToEdit = makeClass({
      name: 'John Doe Class',
      moduleId: module.id,
      classNumber: 2
    })

    await Promise.all([
      inMemoryClassesRepository.create(classToConflict),
      inMemoryClassesRepository.create(classToEdit)
    ])

    const result = await sut.exec({
      name: 'New Class Name',
      classNumber: 1,
      classId: classToEdit.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassNumberIsAlreadyInUseError)
  })
})