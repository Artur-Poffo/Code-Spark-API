import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeImage } from '../../../../../test/factories/make-image'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryCertificatesRepository } from '../../../../../test/repositories/in-memory-certificates-repository'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryImagesRepository } from './../../../../../test/repositories/in-memory-images-repository'
import { CourseAlreadyHasACertificateError } from './errors/course-already-has-a-certificate-error'
import { RegisterCertificateForCourseUseCase } from './register-certificate-for-course'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCertificatesRepository: InMemoryCertificatesRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let sut: RegisterCertificateForCourseUseCase

describe('Register certificate for a course use case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryCertificatesRepository = new InMemoryCertificatesRepository()
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)

    sut = new RegisterCertificateForCourseUseCase(inMemoryCertificatesRepository, inMemoryImagesRepository, inMemoryCoursesRepository)
  })

  it('should be able to register a new certificate for a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    const result = await sut.exec({
      imageId: image.id.toString(),
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      certificate: expect.objectContaining({
        props: expect.objectContaining({
          imageId: image.id
        })
      })
    })
  })

  it('should not be able to register a new certificate for a inexistent course', async () => {
    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    const result = await sut.exec({
      imageId: image.id.toString(),
      courseId: 'inexistentCourseId',
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a new certificate for a course if it already has a certificate', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    await sut.exec({
      imageId: image.id.toString(),
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    const result = await sut.exec({
      imageId: image.id.toString(),
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CourseAlreadyHasACertificateError)
  })
})