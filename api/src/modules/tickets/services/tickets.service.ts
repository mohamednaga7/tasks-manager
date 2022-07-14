import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { User } from '../../users/models/user.model'
import { Ticket } from '../models/ticket.model'
import { CreateTicketInput } from '../types/create-ticket-input.type'
import { UpdateTicketInput } from '../types/update-ticket-input.type'

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
