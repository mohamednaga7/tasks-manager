import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserSigninInput {
	@Field((_type) => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	emailOrUsername: string;

	@Field((_type) => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
