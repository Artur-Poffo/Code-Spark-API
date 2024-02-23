import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import multer from 'fastify-multer'
import { readFileSync } from 'fs'
import { ZodError } from 'zod'
import { env } from './env'
import { certificateRoutes } from './http/routes/certificate'
import { classRoutes } from './http/routes/class'
import { courseRoutes } from './http/routes/course'
import { courseTagRoutes } from './http/routes/course-tag'
import { enrollmentRoutes } from './http/routes/enrollment'
import { evaluationRoutes } from './http/routes/evaluation'
import { fileRoutes } from './http/routes/file'
import { imageRoutes } from './http/routes/image'
import { moduleRoutes } from './http/routes/module'
import { studentRoutes } from './http/routes/student'
import { studentCertificateRoutes } from './http/routes/student-certificate'
import { tagRoutes } from './http/routes/tag'
import { userRoutes } from './http/routes/user'
import { videoRoutes } from './http/routes/video'

export const app = fastify()

// PLugins

app.register(fastifyCors, {
  credentials: true,
  exposedHeaders: ['set-cookie']
})

app.register(fastifyJwt, {
  secret: {
    private: readFileSync('./private-key.pem'),
    public: readFileSync('./public-key.pem')
  },
  cookie: {
    cookieName: 'spark.accesstoken',
    signed: false
  },
  sign: {
    algorithm: 'RS256',
    expiresIn: '1d'
  }
})

app.register(fastifyCookie)

export const upload = multer()

app.register(multer.contentParser)

// API Routes

app.register(userRoutes)
app.register(studentRoutes)
app.register(courseRoutes)
app.register(fileRoutes)
app.register(imageRoutes)
app.register(videoRoutes)
app.register(moduleRoutes)
app.register(classRoutes)
app.register(tagRoutes)
app.register(courseTagRoutes)
app.register(evaluationRoutes)
app.register(enrollmentRoutes)
app.register(certificateRoutes)
app.register(studentCertificateRoutes)

// Custom error handler

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
