import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // 1. Setup the connection pool using the DATABASE_URL from .env
  // Added SSL support for Supabase/Remote connections to ensure connectivity.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  // 2. Create the Prisma PostgreSQL adapter
  const adapter = new PrismaPg(pool)

  // 3. Initialize Prisma Client with the adapter
  // In Prisma 7, the adapter is mandatory when the URL is defined in prisma.config.ts
  const client = new PrismaClient({ adapter })
  
  return client
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
