import { Either, left, right } from "@/core/either"
import { UseCase } from "@/core/use-cases/use-case"
import { Student } from "../../enterprise/entities/Student"
import { HashGenerator } from "../cryptography/hash-generator"
import { InstructorRepository } from "../repositories/instructor-repository"
import { InstructorAlreadyExistsError } from "./errors/instructor-already-exists-error"
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error"

interface RegisterInstructorUseCaseRequest {
  name: string
  email: string
  password: string
  age: number
  cpf: string
  summary: string
}

type RegisterInstructorUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    instructor: Student
  }
>

export class RegisterInstructorUseCase implements UseCase<RegisterInstructorUseCaseRequest, RegisterInstructorUseCaseResponse> {
  constructor(
    private instructorRepository: InstructorRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async exec({
    name,
    email,
    password,
    age,
    cpf,
    summary
  }: RegisterInstructorUseCaseRequest): Promise<RegisterInstructorUseCaseResponse> {
    const instructorWithSameEmail =
      await this.instructorRepository.findByEmail(email)

    if (instructorWithSameEmail) {
      return left(new InstructorAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const instructor = Student.create({
      name,
      email,
      passwordHash: hashedPassword,
      age,
      cpf,
      summary,
    })

    await this.instructorRepository.create(instructor)

    return right({
      instructor,
    })
  }
}