import { UserWithToken } from './../types/user-with-token.type';
import { UserSignupInput } from '../types/user-signup-input.type';
import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	Query,
	Resolver,
	Root,
} from 'type-graphql';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { UserSigninInput } from '../types/user-signin-input.type';
import Container from 'typedi';

@Resolver(User)
export class UsersResolver {
	usersService = Container.get(UsersService);

	@Query((_returns) => User)
	async me(@Arg('id') id: string, @Ctx('currentUser') user: Partial<User>) {
		return this.usersService.getCurrentUser(user);
	}

	@FieldResolver((_type) => String)
	name(@Root() parent: User) {
		return `${parent.firstName} ${parent.lastName}`;
	}

	@Mutation((_returns) => UserWithToken)
	signup(
		@Arg('userSignupInput') userSignupInput: UserSignupInput
	): Promise<UserWithToken> {
		return this.usersService.signupUser(userSignupInput);
	}

	@Mutation((_returns) => UserWithToken)
	signin(
		@Arg('userSigninInput') userSigninInput: UserSigninInput
	): Promise<UserWithToken> {
		return this.usersService.signinUser(userSigninInput);
	}
}
