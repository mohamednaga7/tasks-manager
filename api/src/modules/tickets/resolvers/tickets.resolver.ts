import { ResolverContext } from './../../../types/resolver-context'
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import Container from 'typedi'
import { Ticket } from '../models/ticket.model'
import { TicketsService } from '../services/tickets.service'
import { User } from '../../users/models/user.model'
import { UsersService } from '../../users/services/users.service'
import { CreateTicketInput } from '../types/create-ticket-input.type'
import { UpdateTicketInput } from '../types/update-ticket-input.type'
import { TicketsHistoryService } from '../services/tickets-history.service'
import { TicketsAnalytics } from '../types/tickets-analytics.type'

@Resolver(Ticket)
export class TicketsResolver {
  usersService = Container.get(UsersService)
  ticketsService = Container.get(TicketsService)
  ticketsHistoryService = Container.get(TicketsHistoryService)

  @Query((_returns) => Ticket)
  @Authorized()
  async ticket(@Arg('ticketId') id: string): Promise<Ticket> {
    return this.ticketsService.getTicket(id)
  }

  @Query((_returns) => TicketsAnalytics)
  @Authorized()
  async ticketsAnalytics(): Promise<TicketsAnalytics> {
    return this.ticketsService.getAnalytics()
  }

  @Query((_returns) => [Ticket])
  @Authorized()
  async tickets(
    @Arg('limit', { nullable: true }) limit?: number,
    @Arg('skip', { nullable: true }) skip?: number,
  ) {
    return this.ticketsService.getTickets({ limit, skip })
  }

  @FieldResolver((_type) => User)
  author(@Root() parent: Ticket) {
    return this.usersService.getUser(parent.authorId)
  }

  @FieldResolver((_type) => User, { nullable: true })
  assignedUser(@Root() parent: Ticket) {
    return (
      parent.assignedUserId && this.usersService.getUser(parent.assignedUserId)
    )
  }

  @FieldResolver((_type) => User, { nullable: true })
  async lastUpdatedByUser(@Root() parent: Ticket): Promise<User | null> {
    return parent.lastUpdatedByUserId
      ? this.usersService.getUser(parent.lastUpdatedByUserId)
      : null
  }

  @Mutation((_returns) => Ticket)
  @Authorized()
  createTicket(
    @Arg('input') createTicketInput: CreateTicketInput,
    @Ctx() ctx: ResolverContext,
  ): Promise<Ticket> {
    if (!ctx.req.session.user) {
      throw new Error("You're not authorized to do this")
    }
    return this.ticketsService.createTicket(
      ctx.req.session.user,
      createTicketInput,
    )
  }

  @Mutation((_returns) => Ticket)
  @Authorized()
  async updateTicket(
    @Arg('ticketId') ticketId: string,
    @Ctx() ctx: ResolverContext,
    @Arg('input') updateTicketInput: UpdateTicketInput,
  ): Promise<Ticket> {
    if (!ctx.req.session.user) {
      throw new Error("You're not authorized to do this")
    }
    const updatedTicket = await this.ticketsService.updateTicket(
      ticketId,
      updateTicketInput,
      ctx.req.session.user,
    )

    const updatedField = Object.keys(updateTicketInput)[0] as keyof Ticket

    await this.ticketsHistoryService.createTicketHistory(
      updatedTicket,
      ctx.req.session.user,
      updatedField,
    )

    return updatedTicket
  }
}
