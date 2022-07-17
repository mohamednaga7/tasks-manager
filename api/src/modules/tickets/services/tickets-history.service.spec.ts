import { PrismaClient, TicketStatus } from '@prisma/client'
import 'reflect-metadata'
import Container from 'typedi'
import { User } from '../../users/models/user.model'
import { UsersService } from '../../users/services/users.service'
import { Ticket } from '../models/ticket.model'
import { TicketsHistoryService } from './tickets-history.service'

describe('Tickets Service', () => {
  const mockedPrisma: {
    ticketHistory: {
      findMany: jest.Mock<any, any>
      create: jest.Mock<any, any>
    }
  } = {
    ticketHistory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  }

  const mockedUsersService: {
    getUser: jest.Mock<any, any>
  } = {
    getUser: jest.fn(),
  }

  const mockedTicketHistoryItem = {
    ticketId: '1',
    message: 'changed the ticket title to In Progress',
    updatingUserId: '1',
  }

  beforeEach(() => {
    Container.set(PrismaClient, mockedPrisma)
    Container.set(UsersService, mockedUsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    Container.reset()
  })

  describe('ticket history', () => {
    const mockedTicket: Ticket = {
      id: '1',
      title: 'title',
      description: 'description',
      status: TicketStatus.TODO,
      assignedUserId: '1',
      authorId: '1',
      lastUpdatedByUserId: '1',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      closedAt: new Date('2022-01-01'),
    }
    const mockedUser: User = {
      id: '1',
      firstName: 'first',
      lastName: 'last',
      email: 'test@test.com',
      username: 'test',
    }
    it('should get ticket history for a specific ticket', async () => {
      mockedPrisma.ticketHistory.findMany.mockReturnValue([
        mockedTicketHistoryItem,
      ])
      const ticketHistory = await Container.get(
        TicketsHistoryService,
      ).getTicketHistory('1')

      expect(ticketHistory).toEqual([mockedTicketHistoryItem])
    })

    it('should return an empty array if no ticket history is found', async () => {
      mockedPrisma.ticketHistory.findMany.mockReturnValue([])
      const ticketHistory = await Container.get(
        TicketsHistoryService,
      ).getTicketHistory('1')

      expect(ticketHistory).toEqual([])
    })

    it('should create a ticket history item when a ticket is updated', async () => {
      const mockedUpdatedField = 'status'
      mockedPrisma.ticketHistory.create.mockReturnValue(mockedTicketHistoryItem)
      const ticketHistory = await Container.get(
        TicketsHistoryService,
      ).createTicketHistory(mockedTicket, mockedUser, mockedUpdatedField)

      expect(ticketHistory).toEqual(mockedTicketHistoryItem)
    })

    it('should create a ticket history item when a ticket is assigned', async () => {
      mockedUsersService.getUser.mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
      })
      const mockedUpdatedField = 'assignedUserId'
      mockedPrisma.ticketHistory.create.mockReturnValue(mockedTicketHistoryItem)
      const ticketHistory = await Container.get(
        TicketsHistoryService,
      ).createTicketHistory(mockedTicket, mockedUser, mockedUpdatedField)
      expect(ticketHistory).toEqual(mockedTicketHistoryItem)
    })
  })
})
