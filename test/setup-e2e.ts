import { config } from 'dotenv'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  execSync('yarn prisma:init')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
