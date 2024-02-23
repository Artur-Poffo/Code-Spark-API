# Entra21 TCC - CodeSpark API

## ⚠️ Temporary README

## Functional Requirements

- [x] User must be able to register in the system as "Student" or "Instructor."
- [x] User must be able to authenticate after registration.
- [x] Return information about a user.

- [x] Instructors must be able to register courses on the platform.
- [x] Instructors can register modules for a course.
- [x] Instructors can add classes to modules.
- [x] Should be able to register tags
- [x] Responsible instructor can add "tags" to their course to inform students about technologies present in the course.
- [x] Instructors can create classes and upload videos to them.
- [x] Instructor can upload a certificate template for students upon course completion.
- [x] Return information of an instructor with their courses.

- [x] Return information about a course.
- [x] Return information about a course with its modules.
- [x] Classes and modules must have a field informing their position, e.g. this class is number one, so this is the first class of the course.

- [x] Students can "enroll" to participate in the course.
- [x] Return information about a course with its students.
- [x] Students can mark classes as completed.
- [x] Mark modules as completed after the student views all its classes.
- [x] After completing all modules of a course, that course for a student should be marked as completed.
- [x] Return information about a student with the courses they are enrolled in.
- [x] After completing a course, the student can issue a certificate.

- [x] It should be possible to filter courses by name or "tags."
- [x] Students can evaluate a particular class they are taking with a rating from 1 to 5 to later have an average rating for the course.
- [x] Get course evaluations average

- [x] An instructor should be able to retrieve traffic data for one of their courses.

- [x] CRUDs for all main entities: course, module, class, user, etc.

- [ ] Return information about a course with student progress in your modules and classes.
- [x] Video streaming to watch the classes.

## Business Rules

- [x] User should not be able to register with the same email.
- [x] User should not be able to register with the same CPF.
- [x] Only students can enroll for a course.
- [x] Only students can rate classes.
- [x] Only instructors can register a course.
- [x] A specific instructor cannot register a course with the same name.
- [x] A student should only be able to rate a class once.
- [x] Should not be able to register a course with the same name in same instructor account.
- [x] Should not be able to register a module to a course with the same name twice.
- [x] Should not be able to add a class to a module with the same name twice.
- [x] Should not be able to register a module to a specific course with same name twice.
- [x] A student can only issue one certificate per course.
- [x] A student can only enroll for a particular course once.
- [x] There should not be repeated tags in a course.

## Non-Functional Requirements

- [x] File upload/storage on Cloudflare R2.
- [x] User's password must be encrypted.
- [x] Application data must be persisted in a PostgreSQL database with Docker.
- [x] User must be identified by JWT.
- [x] JWT must use the RS256 algorithm.

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
  - addedAt: Date

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

- [x] Evaluation
- - id: string
  - value: number (1 - 5)
  - userId: string
  - classId: string
  - createdAt: date

- [x] Module
- - id: string
  - name: string
  - description: string
  - moduleNumber: number
  - courseId: string

- [x] Image
- - id: string
  - imageName: string
  - imageType: 'image/jpeg' | 'image/png'
  - body: Buffer
  - size: number
  - storedAt: Date

- [x] Certificate
- - id: string
  - imageId: string
  - courseId: string

- [x] StudentCertificate
- - id: string
  - certificateId: string
  - studentId: string
  - issuedAt: date

- [x] Video
- - id: string
  - videoName: string
  - videoType: 'video/mp4' | 'video/avi'
  - body: Buffer
  - duration: number
  - size: number
  - storedAt: Date

- [x] Class
- - id: string
  - name: string
  - description: string
  - videoId: string
  - classNumber: number
  - moduleId: string

  ## Storage Domain

  - [x] File
  - - id: string
    - fileName: string
    - filType: string
    - body: Buffer
    - fileKey: string
    - size: number
    - storedAt: Date

## Initial Routes (must have changes)

### Users
- [x] GET /users/:userId - Get user details
- [x] POST /users - Register user
- [x] PUT /users/:userId - Update user
- [x] DELETE /users/:userId - Delete user

### Sessions
- [x] POST /sessions - User authentication

### Students
- [x] GET /courses/:courseId/students - Get students enrolled in course
- [ ] GET /students/:studentId/enrollments - Get student courses with instructor and evaluations

### Instructors
- [ ] GET /courses/:courseId/instructor - Get course instructor details
- [ ] GET /instructors/:instructorId/courses - Get instructor courses with instructor and evaluations

### Courses
- [x] GET /courses/:courseId - Get course details
- [ ] GET /courses/:courseId/enrollments/:enrollmentId/progress - Get course details with student progress
- [x] GET /courses/:courseId/stats - Get course statistics, like duration and number of classes
- [x] GET /courses/:courseId/metrics - Get course metrics for a dashboard
- [x] GET /courses - Get recent courses with instructor and evaluation average
- [x] GET /courses/filter/name?q="" - Filter courses by name
- [x] GET /courses/filter/tags?q="" - Filter courses by tags
- [x] POST /courses - Register course
- [x] PUT /courses/:courseId - Update course details
- [x] DELETE /courses/:courseId - Delete course

### Certificate
- [x] POST /courses/:courseId/certificates - Add certificate to course
- [x] DELETE /courses/:courseId/certificates - Remove certificate from course

### StudentCertificate
- [x] POST /enrollments/:enrollmentId/certificates/issue - Issue student certificate

### Modules
- [x] GET /courses/:courseId/modules - Get course modules
- [x] POST /modules - Register module
- [x] GET /modules/:moduleId/classes - Get classes from a module
- [x] PUT /modules/:moduleId - Update module details
- [x] DELETE /modules/:moduleId - Delete module

### Classes
- [x] GET /courses/:courseId/classes - Get course classes
- [x] POST /modules/:moduleId/classes/video/:videoId - Register class
- [x] PUT /classes/:classId - Update class details
- [x] DELETE /classes/:classId - Delete class

### Tags
- [x] GET /tags - Get recent tags
- [x] POST /tags - Register tag

### CourseTags
- [x] GET /courses/:courseId/tags - Get course tags
- [x] POST /courses/:courseId/tags/:tagId - Attach tag to course
- [x] POST /courses/:courseId/tags/:tagId - Remove tag to course

### Evaluations
- [x] GET /courses/:courseId/evaluations/average - Get course evaluation average
- [x] POST /evaluations - Register evaluation
- [x] PUT /evaluations/:evaluationId - Update evaluation

### Enrollments
- [x] POST /courses/:courseId/enroll - Enroll to course
- [x] GET /courses/:courseId/students/:studentId/enrollments - Get enrollment of a student on a course
- [x] DELETE /enrollments/:enrollmentId - Cancel enrollment

### Video
- [x] POST /videos - Upload video
- [x] GET /videos/:videoId - Get video details

### Image
- [x] POST /images - Upload image
- [x] GET /images/:imageId - Get image details

## Potential Refactoring or Updates:

- [x] Implement method for course repository.
- [x] Refactor dependencies in all unit tests.
- [x] Verify the usage of `Promise.all()` and apply destructuring where applicable.
- [x] Review use cases and explore potential improvements.
- [x] Ensure consistent usage of `new UniqueEntityId()` for entity IDs and rectify any inconsistencies.
- [x] Evaluate the Enrollment entity for possible simplifications in managing modules and classes.
- [x] Replace all asynchronous `forEach` loops with `Promise.all()` combined with asynchronous `map`.
- [x] Update error handling in use cases.
- [x] Implement sorting in `findMany` methods of Prisma repositories.
- [x] Refactor database relation names.
- [x] Revise mark as complete functionality for classes and modules system.
- [x] Fix infinite calls to Prisma repositories in some mapper usage scenarios.
- [x] Introduce domain events for Prisma repositories.
- [ ] Implement mappers for mapping domain entities to DTOs.
- [ ] Implement pagination.
- [ ] Implement E2E tests.
- [ ] Implement register user validations, like: email and cpf. - Could it be a value object?
- [ ] Refactor error handling in controllers
- [ ] Refactor the event handler class instance