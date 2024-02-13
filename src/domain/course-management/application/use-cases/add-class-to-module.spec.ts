import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { InMemoryCourseTagsRepository } from './../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { AddClassToModuleUseCase } from './add-class-to-module'
import { ClassAlreadyExistsInThisModuleError } from './errors/class-already-exists-in-this-module-error'
import { ClassNumberIsAlreadyInUseError } from './errors/class-number-is-already-in-use-error'
import { ClassVideoRequiredError } from './errors/class-video-required-error'

let inMemoryVideosRepository: InMemoryVideosRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: AddClassToModuleUseCase

describe('Add class to a module use case', () => {
  beforeEach(() => {
    inMemoryVideosRepository = new InMemoryVideosRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository
    )

    sut = new AddClassToModuleUseCase(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryCoursesRepository, inMemoryVideosRepository
    )
  })

  it('should be able to add a new class to a module', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      class: expect.objectContaining({
        name: 'John Doe Class'
      })
    })
  })

  it('should not be able to add a new class to a module with a inexistent video', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      videoId: 'inexistentVideoId',
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassVideoRequiredError)
  })

  it('should not be able to add a class for a inexistent module', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: 'inexistentModuleId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be possible to add a class to a module if the instructor is not the owner', async () => {
    const owner = makeInstructor()
    const wrongInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(owner),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ instructorId: owner.id })
    await inMemoryCoursesRepository.create(course)

    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      videoId: video.id.toString(),
      instructorId: wrongInstructor.id.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to add a class with same name to a module twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 2,
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassAlreadyExistsInThisModuleError)
  })

  it('should not be able to add a class to a module in same number/position twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    await sut.exec({
      name: 'John Doe Class 1',
      description: 'Class description',
      classNumber: 1, // Add a class to the first position
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    const result = await sut.exec({
      name: 'John Doe Class 2',
      description: 'Class description',
      classNumber: 1, // trying to add a new class for the same position, as the first class
      videoId: video.id.toString(),
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassNumberIsAlreadyInUseError)
  })
})
