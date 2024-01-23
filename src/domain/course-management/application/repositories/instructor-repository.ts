import { Instructor } from "../../enterprise/entities/instructor";

export interface InstructorRepository {
  create(instructor: Instructor): Promise<Instructor>
  findByEmail(email: string): Promise<Instructor | null>
}