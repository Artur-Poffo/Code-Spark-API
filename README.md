<h1 align="center">
  <a href="#">CodeSpark - Entra21 TCC 💻</a>
</h1>

<h3 align="center">
  CodeSpark API
</h3>

<h4 align="center"> 
	 Status: ⚠️ Under Development - MVP Completed ⚠️
</h4>

<p align="center">
 <a href="#about">About</a> •
 <a href="#potential-refactoring-or-updates">Potential Refactoring or Updates</a> •
 <a href="#separation-of-initial-requirements">Separation of initial requirements</a> •
 <a href="#api-routes">API Routes</a> • 
 <a href="#how-it-works">How it works</a> • 
 <a href="#tech-stack">Tech Stack</a> • 
 <a href="#author">Author</a>
</p>

## About

CodeSpark API - CodeSpark API is an API that follows good practices such as: DDD and clean architecture, it is an API responsible for a course platform, it contains a file upload system for Cloudflare R2 (it uses AWS S3 under the hood) and a class evaluation system

It is a TCC project for the [Entra21 training program](https://www.entra21.com.br/) in Vue.js course

---

## Potential Refactoring or Updates

> The API scaled more than we thought and that's why some things were left out even of the MVP, but we intend to continue with the project after the presentation

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
- [ ] Refactor error handling in controllers
- [ ] Refactor the event handler class instance

---

## Separation of initial requirements

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

- [x] Return information about a course with student progress in your modules and classes.
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

---

## API Routes

> This is just the initial documentation as we need to speed up development, it will be refactored after the project is presented

### Users
- [x] GET /users/:userId - Get user details
- [x] POST /users - Register user
- [x] PUT /users/:userId - Update user
- [x] DELETE /users/:userId - Delete user

### Sessions
- [x] POST /sessions - User authentication

### Students
- [x] GET /courses/:courseId/students - Get students enrolled in course
- [x] GET /students/:studentId/enrollments - Get student courses with instructor and evaluations

### Instructors
- [x] GET /courses/:courseId/instructors - Get course instructor details
- [x] GET /instructors/:instructorId/courses - Get instructor courses with instructor and evaluations

### Courses
- [x] GET /courses/:courseId - Get course details
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
- [x] POST /enrollments/:enrollmentId/modules/:moduleId/complete - Mark module as completed
- [x] POST /enrollments/:enrollmentId/classes/:classId/complete - Mark class as completed
- [x] POST /enrollments/:enrollmentId/complete - Mark enrollment as completed
- [x] GET /enrollments/:enrollmentId/progress - Get student enrollment progress
- [x] GET /courses/:courseId/students/:studentId/enrollments - Get enrollment of a student on a course
- [x] GET /enrollments/:enrollmentId/classes/completed - Fetch enrollment completed classes
- [x] GET /enrollments/:enrollmentId/modules/completed - Fetch enrollment completed modules
- [x] DELETE /enrollments/:enrollmentId - Cancel enrollment

### File
- [x] POST /files - Upload file (image or video), multipart/form-data

### Video
- [x] GET /videos/:fileKey - Get video details by fileKey

### Image
- [x] GET /images/:fileKey - Get image details by fileKey

---

## How it works

### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) and [yarn package manager](https://yarnpkg.com/).
In addition, it is good to have an editor to work with the code like [VSCode](https://code.visualstudio.com/) and a REST client like [Insomnia](https://insomnia.rest/)

You will also need to have [Docker](https://www.docker.com/) installed to run the
postgres database with [Docker Compose](https://docs.docker.com/compose/)

**it is very important that before running the project you configure the environment variables as indicated in the file: .env.example**

#### Run the app

```bash
# Clone this repository
$ git clone https://github.com/Artur-Poffo/Code-Spark-API.git

# Access the project folder cmd/terminal
$ cd Code-Spark-API

# install the dependencies
$ yarn

# Inicialize the database
$ yarn docker:init
# This script should create and start a docker container with Postgres database

# Then when you want to stop running docker, run:
$ yarn docker:stop
# Or just press Ctrl+c

# When you want start the container again, run
$ yarn docker:start

# Remember to create the RSA keys for the JWT, instructions in the .env.example file

# Run the application in development mode
$ yarn start:dev

# The server will start at port: 3333 - You can now test in Insomnia or another REST client: http://localhost:3333
```

#### Run tests

```bash
# Run unit tests
$ yarn test:unit

# Run unit tests in watch mode
$ pnpm test:unit:watch

# Run test coverage
$ yarn test:cov
```

---

## Tech Stack

The following tools were used in the construction of the project:

- **Node.js**
- **TypeScript**
- **tsx**
- **tsup**
- **Fastify**
- **@Fastify/jwt**
- **@Fastify/cookie**
- **bcrypt**
- **zod**
- **prisma**
- **vitest**
- **supertest**
- **Docker**

> See the file  [package.json](https://github.com/Artur-Poffo/Code-Spark-API/blob/main/package.json)

---

## Author

- _**Artur Poffo - Developer**_

[![Linkedin Badge](https://img.shields.io/badge/-Artur-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/arturpoffo/)](https://www.linkedin.com/in/arturpoffo/)
[![Gmail Badge](https://img.shields.io/badge/-arturpoffop@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:tgmarinho@gmail.com)](mailto:arturpoffop@gmail.com)

---