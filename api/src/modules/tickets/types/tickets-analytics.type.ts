import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TicketsAnalytics {
  @Field((_type) => Number)
  totalTickets: number

  @Field((_type) => Number)
  todoTickets: number

  @Field((_type) => Number)
  inProgressTickets: number

  @Field((_type) => Number)
  blockedTickets: number

  @Field((_type) => Number)
  inQaTickets: number

  @Field((_type) => Number)
  doneTickets: number

  @Field((_type) => Number)
  deployedTickets: number
}
