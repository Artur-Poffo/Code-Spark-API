import { Student } from "../../enterprise/entities/Student";

export interface StudentsRepository {
  findByEmail(email: string): Promise<Student | null>
  create(student: Student): Promise<Student>
}