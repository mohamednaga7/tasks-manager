import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { User } from '../../users/models/user.model'
import { UsersService } from '../../users/services/users.service'
import { TicketHistory } from '../models/ticket-history.model'
import { Ticket } from '../models/ticket.model'

@Service()
export class TicketsHistoryService {
  constructor(
    private prismaClient: PrismaClient,
    private usersService: UsersService,
  ) {}

  public async getTicketHistory(id: string): Promise<TicketHistory[]> {
    return this.prismaClient.ticketHistory.findMany({
      where: {
        ticketId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  public async createTicketHistory(
    ticket: Ticket,
    updatingUser: User,
    updatedField: keyof Ticket,
  ): Promise<TicketHistory> {
    const message = await this.getTicketHistoryUpdateMessage(
      ticket,
      updatedField,
      updatingUser,
    )
    return this.prismaClient.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        message,
        updatingUserId: updatingUser.id,
      },
    })
  }

  private async getTicketHistoryUpdateMessage(
    ticket: Ticket,
    updatedField: keyof Ticket,
    updatingUser: User,
  ): Promise<string> {
    switch (updatedField) {
      case 'status':
        return `${updatingUser.firstName} ${updatingUser.lastName} changed the ticket status to ${ticket.status}`
      case 'title':
        return `${updatingUser.firstName} ${updatingUser.lastName} changed the ticket title to ${ticket.title}`
      case 'description':
        return `${updatingUser.firstName} ${updatingUser.lastName} changed the ticket description to ${ticket.description}`
      case 'assigneeId':
        const assignedUser = await this.usersService.getUser(ticket.assigneeId!)
        return `${updatingUser.firstName} ${updatingUser.lastName} assigned the ticket to ${assignedUser.firstName} ${assignedUser.lastName}`
      default:
        return `${updatingUser.firstName} ${updatingUser.lastName} updated the ticket`
    }
  }
}
