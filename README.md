# CodeSpark - Entra21 TCC 💻

<h3 align="center">
  CodeSpark API
</h3>

<h4 align="center"> 
	 Status: ⚠️ Under Development - MVP Completed ⚠️
</h4>

<p align="center">
 <a href="#about">About</a> •
 <a href="#potential-refactoring-or-updates">Potential Refactoring or Updates</a> •
 <a href="#separation-of-initial-requirements">Separation of Initial Requirements</a> •
 <a href="#api-routes">API Routes</a> • 
 <a href="#how-it-works">How It Works</a> • 
 <a href="#tech-stack">Tech Stack</a> • 
 <a href="#author">Author</a>
</p>

## About

CodeSpark API - The CodeSpark API adheres to industry best practices such as Domain-Driven Design (DDD) and clean architecture. It serves as the backbone for a course platform, featuring a file upload system integrated with Cloudflare R2 (powered by AWS S3) and a comprehensive class evaluation system.

This project serves as the TCC (Trabalho de Conclusão de Curso - Course Conclusion Work) for the [Entra21 training program](https://www.entra21.com.br/) Vue.js course.

---

## Potential Refactoring or Updates

> The API's scope has expanded beyond our initial expectations, necessitating some features to be deferred even from the MVP. Nevertheless, we're committed to further development post-presentation.

- [x] Implement a method for the course repository.
- [x] Refactor dependencies in all unit tests.
- [x] Optimize the usage of `Promise.all()` and apply destructuring where applicable.
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
- [ ] Implement End-to-End (E2E) tests.
- [ ] Refactor error handling in controllers.
- [ ] Refactor the event handler class instance.

---

## Separation of Initial Requirements

## Functional Requirements

- [x] User must be able to register in the system as either "Student" or "Instructor."
- [x] User must be able to authenticate after registration.
- [x] Return information about a user.

- [x] Instructors must be able to register courses on the platform.
- [x] Instructors can register modules for a course.
- [x] Instructors can add classes to modules.
- [x] Should be able to register tags.
- [x] Responsible instructors can add "tags" to their courses to inform students about technologies present in the course.
- [x] Instructors can create classes and upload videos to them.
- [x] Instructors can upload a certificate template for students upon course completion.
- [x] Return information of an instructor with their courses.

- [x] Return information about a course.
- [x] Return information about a course with its modules.
- [x] Classes and modules must have a field informing their position, e.g., this class is number one, so this is the first class of the course.

- [x] Students can "enroll" to participate in a course.
- [x] Return information about a course with its students.
- [x] Students can mark classes as completed.
- [x] Mark modules as completed after the student views all its classes.
- [x] After completing all modules of a course, that course for a student should be marked as completed.
- [x] Return information about a student with the courses they are enrolled in.
- [x] After completing a course, the student can issue a certificate.

- [x] It should be possible to filter courses by name or "tags."
- [x] Students can evaluate a particular class they are taking with a rating from 1 to 5 to later have an average rating for the course.
- [x] Get course evaluations average.

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
- [x] Should not be able to register a course with the same name in the same instructor account.
- [x] Should not be able to register a module to a course with the same name twice.
- [x] Should not be able to add a class to a module with the same name twice.
- [x] Should not be able to register a module to a specific course with the same name twice.
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

> The following documentation provides an initial overview of API routes. Further refinement will be undertaken post-presentation.

### Users
- [x] GET /users/:userId - Get user details
- [x] POST /users - Register user
- [x] PUT /users/:userId - Update user
- [x] DELETE /users/:userId - Delete user

### Sessions
- [x] POST /sessions - User authentication

### Students
- [x] GET /courses/:courseId/students - Get students enrolled in a course
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
- [x] POST /courses/:courseId/tags/:tagId - Remove tag from course

### Evaluations
- [x] GET /courses/:courseId/evaluations/average - Get course evaluation average
- [x] POST /evaluations - Register evaluation
- [x] PUT /evaluations/:evaluationId - Update evaluation

### Enrollments
- [x] POST /courses/:courseId/enroll - Enroll in a course
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

## How It Works

### Pre-requisites

Before you begin, ensure you have the following tools installed on your machine:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/), an editor like [VSCode](https://code.visualstudio.com/), and a REST client such as [Insomnia](https://insomnia.rest/).

Additionally, Docker is required to run the PostgreSQL database using [Docker Compose](https://docs.docker.com/compose/).

**Before running the project, make sure to configure the environment variables as indicated in the `.env.example` file.**

#### Running the App

```bash
# Clone this repository
$ git clone https://github.com/Artur-Poffo/Code-Spark-API.git

# Navigate to the project directory in your terminal
$ cd Code-Spark-API

# Install dependencies
$ yarn

# Initialize the database
$ yarn docker:init
# This script should create and start a Docker container with the PostgreSQL database

# To stop Docker, run:
$ yarn docker:stop
# Or press Ctrl+C

# To start the container again, run:
$ yarn docker:start

# Generate RSA keys for JWT authentication, as instructed in the .env.example file

# Run the application in development mode
$ yarn start:dev

# The server will start at port 3333. You can now test it using Insomnia or any other REST client: http://localhost:3333
```

#### Run tests

```bash
# Run unit tests
$ yarn test:unit

# Run unit tests in watch mode
$ yarn test:unit:watch

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
- **@aws-sdk/client-s3**
- **Docker**

> See the file  [package.json](https://github.com/Artur-Poffo/Code-Spark-API/blob/main/package.json)

---

## Author

- _**Artur Poffo - Developer**_

[![Linkedin Badge](https://img.shields.io/badge/-Artur-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/arturpoffo/)](https://www.linkedin.com/in/arturpoffo/)
[![Gmail Badge](https://img.shields.io/badge/-arturpoffop@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:tgmarinho@gmail.com)](mailto:arturpoffop@gmail.com)

---