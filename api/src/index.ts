import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import Container from 'typedi';
import { PrismaClient } from '@prisma/client';
import createPrismaClient from './prismaClient';
import { join } from 'path';
import { buildSchema } from 'type-graphql';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const main = async () => {
	const schema = await buildSchema({
		resolvers: [__dirname + '/modules/**/*.resolver.{ts,js}'],
		emitSchemaFile:
			process.env.NODE_ENV === 'development'
				? join(__dirname, '..', '..', 'shared', 'schema.gql')
				: false,
	});

	const apolloServer = new ApolloServer({
		schema,
	});

	// add prisma client to typedi containers to be able to inject it
	Container.set(PrismaClient, createPrismaClient());

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, path: '/api/graphql' });
};

main().then(() => {
	app.listen(port, () => {
		console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
	});
});
