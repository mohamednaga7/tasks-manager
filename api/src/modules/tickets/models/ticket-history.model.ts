import { Field, ID, ObjectType } from 'type-graphql'
import { TicketHistory as PrismaTicketHistory } from '@prisma/client'

@ObjectType()
export class TicketHistory implements Partial<PrismaTicketHistory> {
  @Field((_type) => ID)
  id: string

  @Field((_type) => ID)
  ticketId: string

  @Field((_type) => ID)
  updatingUserId: string

  @Field((_type) => String)
  message: string

  @Field((_type) => Date)
  createdAt: Date
}
