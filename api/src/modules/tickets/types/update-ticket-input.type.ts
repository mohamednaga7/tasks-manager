import { TicketStatus } from '@prisma/client'
import { IsString } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class UpdateTicketInput {
  @Field((_type) => String, { nullable: true })
  @IsString()
  title?: string

  @Field((_type) => String, { nullable: true })
  @IsString()
  description?: string

  @Field((_type) => TicketStatus, { nullable: true })
  status?: TicketStatus

  @Field((_type) => ID, { nullable: true })
  @IsString()
  assigneeId?: string
}
