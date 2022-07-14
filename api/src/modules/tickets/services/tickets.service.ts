import { PrismaClient, TicketStatus } from '@prisma/client'
import { Service } from 'typedi'
import { User } from '../../users/models/user.model'
import { Ticket } from '../models/ticket.model'
import { CreateTicketInput } from '../types/create-ticket-input.type'
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

  public async updateTicket(
    currentUser: User,
    ticketId: string,
    updateTicketInput: UpdateTicketInput,
  ): Promise<Ticket> {
    // TODO: after creating the ticket history feature use currentUser to create history entity
    const ticket = await this.prismaClient.ticket.findUniqueOrThrow({
      where: {
        id: ticketId,
      },
    })

    // check if the user is trying to update the ticket status
    if (updateTicketInput.status) {
      // if the new status is the same as the old status, do nothing just return the ticket
      if (updateTicketInput.status === ticket.status) {
        return ticket
      }

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
      },
    })
  }
}
