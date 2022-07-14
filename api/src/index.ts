import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import connectRedis from 'connect-redis'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import Container from 'typedi'
import { PrismaClient } from '@prisma/client'
import createPrismaClient from './prismaClient'
import { join } from 'path'
import { buildSchema } from 'type-graphql'
import session from 'express-session'
import cors from 'cors'
import { validateEnvironmentVariables } from './utils/validateEnvironmentVariables'
import { redis } from './redis'
import { User } from './modules/users/models/user.model'
import { ResolverContext } from './types/resolver-context'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const main = async () => {
  dotenv.config()

  validateEnvironmentVariables()

  const RedisStore = connectRedis(session)
  const app = express()
  const port = process.env.PORT || 3001

  const corsWhitelist = [
    process.env.FRONTEND_URL!,
    'https://studio.apollographql.com',
  ]

  const corsOptions = {
    credentials: true,
    origin: corsWhitelist,
  }

  app.use(cors(corsOptions))

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'sid',
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        sameSite: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    }),
  )

  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/*.resolver.{ts,js}'],
    emitSchemaFile:
      process.env.NODE_ENV === 'development'
        ? join(__dirname, '..', '..', 'shared', 'schema.gql')
        : false,
    authChecker: ({ context: { req } }) => {
      return !!req.session.user
    },
  })

  const apolloServer = new ApolloServer({
    schema,
    context: ({
      req,
    }: ExpressContext & {
      req: { session: { user?: User } }
    }): ResolverContext => ({ req }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  })

  // add prisma client to typedi containers to be able to inject it
  Container.set(PrismaClient, createPrismaClient())

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    path: '/api/graphql',
    cors: corsOptions,
  })

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
  })
}

main()
