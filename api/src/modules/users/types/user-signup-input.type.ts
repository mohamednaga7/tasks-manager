import {
	IsAlpha,
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserSignupInput {
	@Field((_type) => String)
	@IsAlpha()
	@IsNotEmpty()
	firstName: string;

	@Field((_type) => String)
	@IsAlpha()
	@IsNotEmpty()
	lastName: string;

	@Field((_type) => String)
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Field((_type) => String)
	@IsAlphanumeric()
	@IsNotEmpty()
	@MinLength(5)
	username: string;

	@Field((_type) => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
