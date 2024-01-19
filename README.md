# Entra21 TCC - CodeSpark

## Functional Requirements

- [ ] User must be able to register in the system as "Student" or "Instructor."
- [ ] User must be able to authenticate after registration.
- [ ] Return information about a user.

- [ ] Instructors must be able to register courses on the platform.
- [ ] Instructors can register modules for a course.
- [ ] Instructors can add lessons to modules.
- [ ] Responsible instructor can add "tags" to their course to inform students about technologies present in the course.
- [ ] Instructors can upload videos.
- [ ] Instructor can upload a certificate template for students upon course completion.
- [ ] Return information of an instructor with their courses.

- [ ] Return information about a course.
- [ ] Return information about a course with its students.
- [ ] Return information about a course with its modules and lessons.
- [ ] Video streaming to watch the lessons.

- [ ] Students can "enroll" to participate in the course.
- [ ] Students can mark lessons as completed.
- [ ] Return information about a student with the courses they are enrolled in.
- [ ] Mark modules as completed after the student views all its lessons.
- [ ] After completing a course, the student can issue a certificate.

- [ ] After completing all modules of a course, that course for a student should be marked as completed.
- [ ] It should be possible to filter courses by name or "tags."
- [ ] Students can evaluate a particular course they are taking with a rating from 1 to 5 to later have an average rating for each course.

- [ ] An instructor should be able to retrieve traffic data for one of their courses.

- [ ] CRUDs for all main entities: course, module, lesson, user, etc.

## Business Rules

- [ ] User should not be able to register with the same email.
- [ ] User should not be able to register with the same CPF.

## Non-Functional Requirements

- [ ] File upload on Cloudflare R2.
- [ ] User's password must be encrypted.
- [ ] Application data must be persisted in a PostgreSQL database with Docker.
- [ ] All data listings must be paginated with 20 items per page and have an attribute of total items.
- [ ] User must be identified by JWT.
- [ ] JWT must use the RS256 algorithm.

## Initial Entities

- [ ] User - Aggregate (Student/Instructor).
- [ ] Student.
- [ ] Instructor.
- [ ] Course.
- [ ] Module.
- [ ] Class.