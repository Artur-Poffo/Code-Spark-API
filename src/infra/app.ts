import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import multer from 'fastify-multer'
import { readFileSync } from 'fs'
import { ZodError } from 'zod'
import { env } from './env'
import { courseRoutes } from './http/routes/course'
import { imageRoutes } from './http/routes/image'
import { userRoutes } from './http/routes/user'

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
app.register(courseRoutes)
app.register(imageRoutes)

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
