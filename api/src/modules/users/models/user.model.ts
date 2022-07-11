import { Field, ID, ObjectType, Root } from 'type-graphql';

@ObjectType()
export class User {
	@Field((_type) => ID)
	readonly id: string;

	@Field((_type) => String)
	firstName: string;

	@Field((_type) => String)
	lastName: string;

	@Field((_type) => String)
	email: string;

	@Field((_type) => String)
	username: string;
}
