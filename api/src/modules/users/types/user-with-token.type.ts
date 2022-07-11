import { Field, ObjectType } from 'type-graphql';
import { User } from '../models/user.model';

@ObjectType()
export class UserWithToken {
	@Field((_type) => User)
	user: User;

	@Field((_type) => String)
	token: string;
}
