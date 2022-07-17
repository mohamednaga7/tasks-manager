export const validateEnvironmentVariables = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined')
  }
  if (!process.env.PORT) {
    throw new Error('PORT is not defined')
  }
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined')
  }
}
