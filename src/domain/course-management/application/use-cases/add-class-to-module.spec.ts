import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { AddClassToModuleUseCase } from './add-class-to-module'
import { ClassAlreadyExistsInThisModule } from './errors/class-already-exists-in-this-module'
import { ClassNumberIsAlreadyInUse } from './errors/class-number-is-already-in-use'

let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let sut: AddClassToModuleUseCase

describe('Add class to a module use case', () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryClassesRepository, inMemoryInstructorsRepository)
    sut = new AddClassToModuleUseCase(inMemoryClassesRepository, inMemoryModulesRepository, inMemoryCoursesRepository)
  })

  it('should be able to add a new class to a module', async () => {
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
      duration: 600,
      videoKey: 'video-key',
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

  it('should not be able to add a class for a inexistent module', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      duration: 600,
      videoKey: 'video-key',
      instructorId: course.instructorId.toString(),
      moduleId: 'inexistentModuleId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be possible to add a class to a module if the instructor is not the sponsor', async () => {
    const sponsor = makeInstructor()
    const wrongInstructor = makeInstructor()
    await Promise.all([
      inMemoryInstructorsRepository.create(sponsor),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ instructorId: sponsor.id })
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
      duration: 600,
      videoKey: 'video-key',
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

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 1,
      duration: 600,
      videoKey: 'video-key',
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    const result = await sut.exec({
      name: 'John Doe Class',
      description: 'Class description',
      classNumber: 2,
      duration: 600,
      videoKey: 'video-key',
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassAlreadyExistsInThisModule)
  })

  it('should not be able to add a class to a module in same number/position twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    await sut.exec({
      name: 'John Doe Class 1',
      description: 'Class description',
      classNumber: 1, // Add a class to the first position
      duration: 600,
      videoKey: 'video-key',
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    const result = await sut.exec({
      name: 'John Doe Class 2',
      description: 'Class description',
      classNumber: 1, // trying to add a new class for the same position, as the first class
      duration: 600,
      videoKey: 'video-key',
      instructorId: course.instructorId.toString(),
      moduleId: module.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClassNumberIsAlreadyInUse)
  })
})
