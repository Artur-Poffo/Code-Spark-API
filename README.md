# Entra21 TCC - CodeSpark API

## Functional Requirements

- [x] User must be able to register in the system as "Student" or "Instructor."
- [x] User must be able to authenticate after registration.
- [x] Return information about a user.

- [x] Instructors must be able to register courses on the platform.
- [x] Instructors can register modules for a course.
- [x] Instructors can add classes to modules.
- [x] Should be able to register tags
- [x] Responsible instructor can add "tags" to their course to inform students about technologies present in the course.
- [ ] Instructors can create classes and upload videos to them.
- [ ] Instructor can upload a certificate template for students upon course completion.
- [ ] Return information of an instructor with their courses.

- [ ] Return information about a course.
- [ ] Return information about a course with its students.
- [ ] Return information about a course with its modules and classes.
- [x] Classes and modules must have a field informing their position, e.g. this class is number one, so this is the first class of the course.
- [ ] Video streaming to watch the classes.

- [ ] Students can "enroll" to participate in the course.
- [ ] Students can mark classes as completed.
- [ ] Return information about a student with the courses they are enrolled in.
- [ ] Mark modules as completed after the student views all its classes.
- [ ] After completing a course, the student can issue a certificate.

- [ ] After completing all modules of a course, that course for a student should be marked as completed.
- [ ] It should be possible to filter courses by name or "tags."
- [ ] Students can evaluate a particular course they are taking with a rating from 1 to 5 to later have an average rating for each course.

- [ ] An instructor should be able to retrieve traffic data for one of their courses.

- [ ] CRUDs for all main entities: course, module, lesson, user, etc.

## Business Rules

- [x] User should not be able to register with the same email.
- [x] User should not be able to register with the same CPF.
- [ ] Only students can enroll for a course.
- [ ] Only students can rate courses and classes.
- [x] Only instructors can register a course.
- [x] A specific instructor cannot register a course with the same name.
- [ ] A student should only be able to rate a class and a given course once.
- [x] Should not be able to register a course with the same name in same instructor account.
- [x] Should not be able to register a module to a course with the same name twice.
- [x] Should not be able to add a class to a module with the same name twice.
- [x] Should not be able to register a module to a specific course with same name twice.
- [ ] A student can only issue one certificate per course.
- [ ] A student can only enroll for a particular course once.
- [ ] There should not be repeated tags in a course.

## Non-Functional Requirements

- [ ] File upload/storage on Cloudflare R2.
- [x] User's password must be encrypted.
- [ ] Application data must be persisted in a PostgreSQL database with Docker.
- [ ] All data listings must be paginated with 20 items per page and have an attribute of total number of items.
- [ ] User must be identified by JWT.
- [ ] JWT must use the RS256 algorithm.

## Initial Entities (Domain)

> It's just an `initial` abstraction, it will be increased, fields type are only primitive

### Course-Management Domain

- [x] User
- - name: string
  - email: string
  - passwordHash: string
  - age: number
  - cpf: string
  - summary: string
  - profileImageKey: string | null
  - bannerImageKey: string | null
  - registeredAt: date

- [x] Student
- - studentId: string
  - ...patternData (User)

- [x] Instructor
- - instructorId: string
  - ...patternData (User)

- [x] Course
- - id: string
  - name: string
  - description: string
  - instructorId: string
  - coverImageKey: string
  - bannerImageKey: string
  - createdAt: date

- [x] Tag
- - id: string
  - value: string

- [x] CourseTag
- - id: string
  - courseId: string
  - tagId: string

- [x] Enrollment
- - id: string
  - studentId: string
  - courseId: string
  - completedClasses: string[] (Or a watched list 🤔)
  - completedModules: string[] (Or a watched list 🤔)
  - ocurredAt: date
  - completedAt: date | null

- [x] Rate
- - id: string
  - value: number (1 - 5)
  - userId: string
  - courseId: string | null
  - classId: string | null
  - createdAt: date

- [x] Module
- - id: string
  - name: string
  - description: string
  - moduleNumber: number
  - courseId: string

- [x] Certificate
- - id: string
  - imageKey: string
  - courseId: string

- [x] StudentCertificate
- - id: string
  - certificateId: string
  - studentId: string
  - issuedAt: date

- [x] Class
- - id: string
  - name: string
  - description: string
  - duration: number
  - videoKey: string
  - classNumber: number
  - moduleId: string

  ## Storage Domain

  - [x] File
  - - id: string
    - fileName: string
    - filType: string
    - fileKey: string