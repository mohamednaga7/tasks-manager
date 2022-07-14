import {
  Arg,
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import Container from 'typedi'
import { TicketsHistoryService } from '../services/tickets-history.service'
import { TicketHistory } from '../models/ticket-history.model'
import { Ticket } from '../models/ticket.model'
import { TicketsService } from '../services/tickets.service'
import { User } from '../../users/models/user.model'
import { UsersService } from '../../users/services/users.service'

@Resolver(TicketHistory)
export class TicketHistoryResolver {
  ticketHistoryService = Container.get(TicketsHistoryService)
  ticketsService = Container.get(TicketsService)
  usersService = Container.get(UsersService)

  @Query((_returns) => [TicketHistory])
  @Authorized()
  async ticketHistory(
    @Arg('ticketId') ticketId: string,
  ): Promise<TicketHistory[]> {
    return this.ticketHistoryService.getTicketHistory(ticketId)
  }

  @FieldResolver((_returns) => Ticket)
  async ticket(@Root() parent: TicketHistory) {
    return this.ticketsService.getTicket(parent.ticketId)
  }

  @FieldResolver((_returns) => User)
  async updatingUser(@Root() parent: TicketHistory) {
    return this.usersService.getUser(parent.updatingUserId)
  }
}
