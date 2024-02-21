import { makeOnImageUploaded } from '@/domain/storage/application/subscribers/factories/make-on-image-uploaded'
import { upload } from '@/infra/app'
import { type FastifyInstance } from 'fastify'
import { uploadImageController } from '../controllers/upload-image'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function imageRoutes(app: FastifyInstance) {
  makeOnImageUploaded()

  app.post('/images', { onRequest: [verifyJwt], preHandler: [upload.single('file')] }, uploadImageController)
}
