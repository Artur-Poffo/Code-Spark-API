import { FakeHasher } from "../../../../../test/cryptography/fake-hasher"
import { InMemoryStudentsRepository } from "../../../../../test/repositories/in-memory-students-repository"
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error"
import { RegisterStudentUseCase } from "./register-student"

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe("Register student use case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it("should be able to register a new student", async () => {
    const result = await sut.exec({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: '12345',
      summary: "Summary",
      age: 20,
      cpf: '111.111.111-11',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0]
    })
  })

  it("should not be able to register a new student with same email twice", async () => {
    const email = "johndoe@gmail.com"

    await sut.exec({
      name: "John Doe",
      email,
      password: '12345',
      summary: "Summary",
      age: 20,
      cpf: '111.111.111-11',
    })

    const result = await sut.exec({
      name: "John Doe",
      email,
      password: '12345',
      summary: "Summary",
      age: 20,
      cpf: '111.111.111-11',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })

  it("should hash student password upon registration", async () => {
    const result = await sut.exec({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: '12345',
      summary: "Summary",
      age: 20,
      cpf: '111.111.111-11',
    })

    const hashedPassword = await fakeHasher.hash('12345')

    expect(inMemoryStudentsRepository.items[0].passwordHash).toEqual(hashedPassword)
  })
})