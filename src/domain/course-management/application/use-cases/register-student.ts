import { Either, left, right } from "@/core/either"
import { UseCase } from "@/core/use-cases/use-case"
import { Student } from "../../enterprise/entities/Student"
import { HashGenerator } from "../cryptography/hash-generator"
import { StudentsRepository } from "../repositories/students-repository"
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error"

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
  age: number
  cpf: string
  summary: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

export class RegisterStudentUseCase implements UseCase<RegisterStudentUseCaseRequest, RegisterStudentUseCaseResponse> {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async exec({
    name,
    email,
    password,
    age,
    cpf,
    summary
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      passwordHash: hashedPassword,
      age,
      cpf,
      summary,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}