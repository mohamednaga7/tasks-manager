import { Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql'
import { Ticket as PrismaTicket, TicketStatus } from '@prisma/client'

registerEnumType(TicketStatus, { name: 'TicketStatus' })

@ObjectType()
export class Ticket implements Partial<PrismaTicket> {
  @Field((_type) => ID)
  readonly id: string

  @Field((_type) => String)
  title: string

  @Field((_type) => String)
  description: string

  @Field((_type) => TicketStatus)
  status: TicketStatus

  @Field((_type) => ID)
  authorId: string

  @Field((_type) => ID, { nullable: true })
  assigneeId?: string

  @Field((_type) => String, { nullable: true })
  lastUpdatedByUserId?: string | null

  @Field((_type) => Date)
  createdAt: Date

  @Field((_type) => Date)
  updatedAt: Date

  @Field((_type) => Date)
  closedAt: Date | null
}
