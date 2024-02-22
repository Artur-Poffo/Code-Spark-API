import { upload } from '@/infra/app'
import { makeOnImageKeyGenerated } from '@/infra/events/factories/make-on-image-key-generated'
import { makeOnImageUploaded } from '@/infra/events/factories/make-on-image-uploaded'
import { type FastifyInstance } from 'fastify'
import { uploadImageController } from '../controllers/upload-image'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function imageRoutes(app: FastifyInstance) {
  makeOnImageUploaded()
  makeOnImageKeyGenerated()

  app.post('/images', { onRequest: [verifyJwt], preHandler: [upload.single('image')] }, uploadImageController)
}