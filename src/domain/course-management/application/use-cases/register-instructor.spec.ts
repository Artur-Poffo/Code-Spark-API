import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { InstructorAlreadyExistsError } from './errors/instructor-already-exists-error'
import { RegisterInstructorUseCase } from './register-instructor'

let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let fakeHasher: FakeHasher
let sut: RegisterInstructorUseCase

describe('Register instructor use case', () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    fakeHasher = new FakeHasher()
    sut = new RegisterInstructorUseCase(inMemoryInstructorsRepository, fakeHasher)
  })

  it('should be able to register a new instructor', async () => {
    const result = await sut.exec({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf: '111.111.111-11'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      instructor: inMemoryInstructorsRepository.items[0]
    })
  })

  it('should not be able to register a new instructor with same email twice', async () => {
    const email = 'johndoe@gmail.com'

    await sut.exec({
      name: 'John Doe',
      email,
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf: '111.111.111-11'
    })

    const result = await sut.exec({
      name: 'John Doe',
      email,
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf: '111.111.111-11'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InstructorAlreadyExistsError)
  })

  it('should not be able to register a new instructor with same cpf twice', async () => {
    const cpf = '111.111.111-11'

    await sut.exec({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf
    })

    const result = await sut.exec({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InstructorAlreadyExistsError)
  })

  it('should hash instructor password upon registration', async () => {
    await sut.exec({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345',
      summary: 'Summary',
      age: 20,
      cpf: '111.111.111-11'
    })

    const hashedPassword = await fakeHasher.hash('12345')

    expect(inMemoryInstructorsRepository.items[0].passwordHash).toEqual(hashedPassword)
  })
})
