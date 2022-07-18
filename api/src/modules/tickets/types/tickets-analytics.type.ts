import { Field, ObjectType } from 'type-graphql'
import { Ticket } from '../models/ticket.model'

@ObjectType()
export class TicketsAnalytics {
  @Field((_type) => Number)
  totalTicketsCount: number

  @Field((_type) => Number)
  todoTicketsCount: number

  @Field((_type) => Number)
  inProgressTicketsCount: number

  @Field((_type) => Number)
  blockedTicketsCount: number

  @Field((_type) => Number)
  inQaTicketsCount: number

  @Field((_type) => Number)
  doneTicketsCount: number

  @Field((_type) => Number)
  deployedTicketsCount: number
}
