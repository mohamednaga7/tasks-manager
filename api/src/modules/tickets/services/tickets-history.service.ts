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
  ): Promise<string> {
    switch (updatedField) {
      case 'status':
        return `changed the ticket status to ${ticket.status}`
      case 'title':
        return `changed the ticket title to ${ticket.title}`
      case 'description':
        return `changed the ticket description to ${ticket.description}`
      case 'assignedUserId':
        const assignedUser = await this.usersService.getUser(
          ticket.assignedUserId!,
        )
        return `assigned the ticket to ${assignedUser.firstName} ${assignedUser.lastName}`
      default:
        return `updated the ticket`
    }
  }
}
