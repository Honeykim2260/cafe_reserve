import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'

declare global {
  var __prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.__prisma || new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query: ' + e.query)
    logger.debug('Params: ' + e.params)
    logger.debug('Duration: ' + e.duration + 'ms')
  })
}

prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e)
})

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e)
})

prisma.$on('info', (e) => {
  logger.info('Prisma Info:', e)
})

export async function connectDatabase() {
  try {
    await prisma.$connect()
    logger.info('데이터베이스 연결 성공')
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`
    logger.info('데이터베이스 연결 테스트 성공')
  } catch (error) {
    logger.error('데이터베이스 연결 실패:', error)
    throw error
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    logger.info('데이터베이스 연결 해제 완료')
  } catch (error) {
    logger.error('데이터베이스 연결 해제 실패:', error)
    throw error
  }
}

export { prisma }
export default prisma