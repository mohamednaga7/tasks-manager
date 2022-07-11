import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { UserSignupInput } from '../types/user-signup-input.type';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { UserSigninInput } from '../types/user-signin-input.type';
import { UserWithToken } from '../types/user-with-token.type';

@Service()
export class UsersService {
	constructor(private prismaClient: PrismaClient) {}

	public async getCurrentUser(authUser: Partial<User>): Promise<User> {
		const user = await this.prismaClient.user.findUniqueOrThrow({
			where: {
				id: authUser.id,
			},
		});
		return user;
	}

	public async signupUser(
		userSignupInput: UserSignupInput
	): Promise<UserWithToken> {
		const foundUser = await this.prismaClient.user.findFirst({
			where: {
				OR: [
					{ email: userSignupInput.email },
					{ username: userSignupInput.username },
				],
			},
		});

		if (foundUser) throw new Error('User already exist');

		const hashedPassword = await hash(userSignupInput.password, 12);

		const user = await this.prismaClient.user.create({
			data: {
				...userSignupInput,
				password: hashedPassword,
			},
		});

		const token = sign(
			{ id: user.id, email: user.email, username: user.username },
			process.env.JWT_SECRET!
		);

		return { user, token };
	}

	public async signinUser(
		userSigninInput: UserSigninInput
	): Promise<UserWithToken> {
		const user = await this.prismaClient.user.findFirstOrThrow({
			where: {
				OR: [
					{ email: userSigninInput.emailOrUsername },
					{ username: userSigninInput.emailOrUsername },
				],
			},
		});

		const isPasswordCorrect = await compare(
			userSigninInput.password,
			user.password
		);

		if (!isPasswordCorrect) throw new Error('Wrong Credentials');

		const token = sign(
			{ id: user.id, email: user.email, username: user.username },
			process.env.JWT_SECRET!
		);

		return { user, token };
	}
}
