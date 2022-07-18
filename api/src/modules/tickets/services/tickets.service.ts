import { PrismaClient, TicketStatus } from '@prisma/client'
import { Service } from 'typedi'
import { User } from '../../users/models/user.model'
import { Ticket } from '../models/ticket.model'
import { CreateTicketInput } from '../types/create-ticket-input.type'
import { TicketsAnalytics } from '../types/tickets-analytics.type'
import { UpdateTicketInput } from '../types/update-ticket-input.type'
import { ticketStatusFlow } from './ticket-status-flow'

@Service()
export class TicketsService {
  constructor(private prismaClient: PrismaClient) {}

  public async getTicket(id: string): Promise<Ticket> {
    return this.prismaClient.ticket.findUniqueOrThrow({
      where: {
        id,
      },
    })
  }

  public async getTickets({ limit = 20, skip = 0 }): Promise<Ticket[]> {
    return this.prismaClient.ticket.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  public async createTicket(
    currentUser: User,
    createTicketInput: CreateTicketInput,
  ): Promise<Ticket> {
    return this.prismaClient.ticket.create({
      data: {
        ...createTicketInput,
        authorId: currentUser.id,
      },
    })
  }

  public async getAnalytics(): Promise<TicketsAnalytics> {
    const [
      totalTicketsCount,
      todoTicketsCount,
      inProgressTicketsCount,
      blockedTicketsCount,
      inQaTicketsCount,
      doneTicketsCount,
      deployedTicketsCount,
    ] = await Promise.all([
      await this.prismaClient.ticket.count(),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.TODO },
      }),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.IN_PROGRESS },
      }),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.BLOCKED },
      }),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.IN_QA },
      }),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.DONE },
      }),
      await this.prismaClient.ticket.count({
        where: { status: TicketStatus.DEPLOYED },
      }),
    ])
    return {
      totalTicketsCount,
      todoTicketsCount,
      inProgressTicketsCount,
      blockedTicketsCount,
      inQaTicketsCount,
      doneTicketsCount,
      deployedTicketsCount,
    }
  }

  public async updateTicket(
    ticketId: string,
    updateTicketInput: UpdateTicketInput,
    currentUser: User,
  ): Promise<Ticket> {
    const ticket = await this.prismaClient.ticket.findUniqueOrThrow({
      where: {
        id: ticketId,
      },
    })

    // check if the user is trying to update the ticket status
    if (updateTicketInput.status) {
      // if the ticket is deployed, throw error because it can't be updated
      if (ticket.status === TicketStatus.DEPLOYED) {
        throw new Error(
          'Cannot update ticket status after it has been deployed',
        )
      }

      // get array of available status changes for the current ticket status
      const availableNextStatuses: TicketStatus[] =
        ticketStatusFlow[ticket.status]
      if (!availableNextStatuses.includes(updateTicketInput.status)) {
        throw new Error(
          `Cannot update ticket status from ${ticket.status} to ${updateTicketInput.status}`,
        )
      }
    }

    return this.prismaClient.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        ...updateTicketInput,
        lastUpdatedByUserId: currentUser.id,
      },
    })
  }
}
