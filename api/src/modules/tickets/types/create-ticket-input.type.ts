import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class CreateTicketInput {
  @Field((_type) => String)
  @IsString()
  @IsNotEmpty()
  title: string

  @Field((_type) => String)
  @IsString()
  @IsNotEmpty()
  description: string

  @Field((_type) => ID, { nullable: true })
  @IsString()
  assignedUserId?: string
}
