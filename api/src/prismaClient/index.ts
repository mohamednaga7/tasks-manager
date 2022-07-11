import { Prisma, PrismaClient } from '@prisma/client';

const getPrismaLogLevels = () => {
	const logLevels: Array<Prisma.LogLevel | Prisma.LogDefinition> = [
		'warn',
		'error',
	];

	if (process.env.PRISMA_QUERY_LOGGING === 'true') {
		logLevels.push({
			emit: 'event',
			level: 'query',
		});
		logLevels.push('query');
	}

	if (process.env.PRISMA_INFO_LOGGING === 'true') {
		logLevels.push('info');
	}

	return logLevels;
};

export default function createPrismaClient(): PrismaClient {
	return new PrismaClient({
		log: getPrismaLogLevels(),
	});
}
