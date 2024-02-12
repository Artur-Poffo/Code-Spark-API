import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { type InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { GetCourseStatsUseCase } from './get-course-stats'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetCourseStatsUseCase

describe('Get course stats use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new GetCourseStatsUseCase(
      inMemoryCoursesRepository,
      inMemoryVideosRepository,
      inMemoryModulesRepository
    )
  })

  it('should be able to get correctly course stats', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const firstVideo = makeVideo({ duration: 60 })
    const secondVideo = makeVideo({ duration: 26 })

    await Promise.all([
      inMemoryVideosRepository.create(firstVideo),
      inMemoryVideosRepository.create(secondVideo)
    ])

    const firstClass = makeClass({ name: 'John Doe Class 1', moduleId: module.id, classNumber: 1, videoId: firstVideo.id })
    const secondClass = makeClass({ name: 'John Doe Class 2', moduleId: module.id, classNumber: 2, videoId: secondVideo.id })

    await Promise.all([
      inMemoryClassesRepository.create(firstClass),
      inMemoryClassesRepository.create(secondClass)
    ])

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      duration: 86,
      numberOfClasses: 2
    })
  })

  it('should not be able to get course stats from a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
