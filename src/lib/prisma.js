import { PrismaClient } from '@prisma/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    console.error('[Prisma] DATABASE_URL is missing')
    return new PrismaClient()
  }

  try {
    if (url.includes('db.prisma.io')) {
      console.log('[Prisma] Using Prisma Postgres Adapter')
      const adapter = new PrismaPostgresAdapter({ connectionString: url })
      return new PrismaClient({ adapter })
    }

    if (url.includes('postgres') || url.includes('neon.tech')) {
      console.log('[Prisma] Using standard PG Adapter')
      const pool = new pg.Pool({ 
        connectionString: url,
        ssl: { rejectUnauthorized: false }
      })
      const adapter = new PrismaPg(pool)
      return new PrismaClient({ adapter })
    }

    return new PrismaClient()
  } catch (error) {
    console.error('[Prisma] Initialization failed:', error)
    throw error
  }
}

const globalForPrisma = globalThis
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
