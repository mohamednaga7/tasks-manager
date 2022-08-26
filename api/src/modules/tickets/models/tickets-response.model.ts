import { TicketStatus } from '@prisma/client'
import { Field, ObjectType } from 'type-graphql'
import { Ticket } from './ticket.model'

@ObjectType()
class TicketsCountWithStatus {
  @Field((_type) => TicketStatus)
  status: TicketStatus

  @Field((_type) => Number)
  _count: number
}

@ObjectType()
export class TicketsResponse {
  @Field((_type) => [Ticket])
  tickets: Ticket[]

  @Field((_type) => Number)
  totalCount: number

  @Field((_type) => [TicketsCountWithStatus])
  ticketsCountByStatus: TicketsCountWithStatus[]
}
