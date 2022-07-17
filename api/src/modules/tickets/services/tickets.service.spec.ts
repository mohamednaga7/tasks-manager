import { PrismaClient, TicketStatus, User } from '@prisma/client'
import 'reflect-metadata'
import Container from 'typedi'
import { TicketsService } from './tickets.service'

describe('Tickets Service', () => {
  const mockedPrisma: {
    ticket: {
      findUniqueOrThrow: jest.Mock<any, any>
      findMany: jest.Mock<any, any>
      findFirst: jest.Mock<any, any>
      create: jest.Mock<any, any>
      update: jest.Mock<any, any>
    }
    ticketUpdateHistory: {
      create: jest.Mock<any, any>
    }
  } = {
    ticket: {
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    ticketUpdateHistory: {
      create: jest.fn(),
    },
  }

  const mockedTicket = {
    id: '1',
    title: 'Ticket 1',
    description: 'Ticket 1 description',
    status: TicketStatus.TODO,
    authorId: '1',
    lastUpdatedById: '1',
    assignedUserId: '1',
    assignedUser: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      username: 'test',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    Container.set(PrismaClient, mockedPrisma)
  })

  afterEach(() => {
    jest.clearAllMocks()
    Container.reset()
  })

  describe('get ticket details', () => {
    it('should return user', async () => {
      mockedPrisma.ticket.findUniqueOrThrow.mockResolvedValue(mockedTicket)
      expect(
        await Container.get(TicketsService).getTicket(mockedTicket.id),
      ).toEqual(mockedTicket)
      expect(mockedPrisma.ticket.findUniqueOrThrow).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockedTicket.id },
      })
    })
  })

  describe('get tickets list', () => {
    const mockedTicketsList = new Array(30)
      .fill(mockedTicket)
      .map((ticket, index) => ({
        ...ticket,
        id: String(index),
      }))

    it('should return empty array when no tickets found', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue([])
      const response = await Container.get(TicketsService).getTickets({
        limit: 10,
        skip: 0,
      })
      expect(response).toHaveLength(0)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('should return the first 20 tickets if no pagination sent', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue(
        mockedTicketsList.slice(0, 20),
      )
      const response = await Container.get(TicketsService).getTickets({
        limit: undefined,
        skip: undefined,
      })
      expect(response).toHaveLength(20)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 20,
        skip: 0,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(response[0].id).toBe('0')
      expect(response[19].id).toBe('19')
    })

    it('should return first 10 when receiving a pagination of limit: 10 and skip: 0', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue(
        mockedTicketsList.slice(0, 10),
      )
      const response = await Container.get(TicketsService).getTickets({
        limit: 10,
        skip: 0,
      })
      expect(response).toHaveLength(10)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(response[0].id).toBe('0')
      expect(response[9].id).toBe('9')
    })

    it('should skip the first 10 tickets when receiving a pagination of limit: 10 and skip: 10', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue(
        mockedTicketsList.slice(10, 20),
      )
      const response = await Container.get(TicketsService).getTickets({
        limit: 10,
        skip: 10,
      })
      expect(response).toHaveLength(10)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 10,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(response[0].id).toBe('10')
      expect(response[9].id).toBe('19')
    })

    it('should return last 5 when the remaining tickets after skipping 10 are less than 5', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue(
        mockedTicketsList.slice(25, 30),
      )
      const response = await Container.get(TicketsService).getTickets({
        limit: 10,
        skip: 25,
      })
      expect(response).toHaveLength(5)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 25,
        orderBy: {
          createdAt: 'desc',
        },
      })
      expect(response[0].id).toBe('25')
      expect(response[4].id).toBe('29')
    })

    it('should return empty array when skip is greater than the total tickets', async () => {
      mockedPrisma.ticket.findMany.mockResolvedValue([])
      const response = await Container.get(TicketsService).getTickets({
        limit: 10,
        skip: 30,
      })
      expect(response).toHaveLength(0)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 30,
        orderBy: {
          createdAt: 'desc',
        },
      })
    })
  })

  describe('create ticket', () => {
    it('should create ticket', async () => {
      mockedPrisma.ticket.create.mockResolvedValue(mockedTicket)
      const {
        title,
        description,
        assignedUserId,
        assignedUser,
        ...otherTicketData
      } = mockedTicket
      const response = await Container.get(TicketsService).createTicket(
        assignedUser,
        { title, description, assignedUserId },
      )
      expect(response).toEqual(mockedTicket)
      expect(mockedPrisma.ticket.create).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          authorId: '1',
          assignedUserId,
        },
      })
    })
  })

  describe('update ticket', () => {
    it('should update ticket status if requested status is in the correct flow', async () => {
      mockedPrisma.ticket.update.mockResolvedValue(mockedTicket)
      const response = await Container.get(TicketsService).updateTicket(
        mockedTicket.id,
        { status: TicketStatus.IN_PROGRESS },
        mockedTicket.assignedUser,
      )
      expect(response).toEqual(mockedTicket)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: mockedTicket.id },
        data: { status: TicketStatus.IN_PROGRESS, lastUpdatedByUserId: '1' },
      })
    })

    it('should throw an error if requested status is not in the correct flow', async () => {
      mockedPrisma.ticket.update.mockResolvedValue(mockedTicket)
      await expect(
        Container.get(TicketsService).updateTicket(
          mockedTicket.id,
          { status: TicketStatus.DONE },
          mockedTicket.assignedUser,
        ),
      ).rejects.toThrowError('Cannot update ticket status from TODO to DONE')
    })

    it('should update ticket title', async () => {
      mockedPrisma.ticket.update.mockResolvedValue(mockedTicket)
      const response = await Container.get(TicketsService).updateTicket(
        mockedTicket.id,
        { title: 'New title' },
        mockedTicket.assignedUser,
      )
      expect(response).toEqual(mockedTicket)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: mockedTicket.id },
        data: { title: 'New title', lastUpdatedByUserId: '1' },
      })
    })

    it('should update ticket description', async () => {
      mockedPrisma.ticket.update.mockResolvedValue(mockedTicket)
      const response = await Container.get(TicketsService).updateTicket(
        mockedTicket.id,
        { description: 'New description' },
        mockedTicket.assignedUser,
      )
      expect(response).toEqual(mockedTicket)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: mockedTicket.id },
        data: { description: 'New description', lastUpdatedByUserId: '1' },
      })
    })

    it('should update ticket assigned user', async () => {
      const updatedTicket = {
        ...mockedTicket,
        assignedUser: { ...mockedTicket.assignedUser, id: '2' },
      }
      mockedPrisma.ticket.update.mockResolvedValue(updatedTicket)
      const response = await Container.get(TicketsService).updateTicket(
        mockedTicket.id,
        { assignedUserId: '2' },
        mockedTicket.assignedUser,
      )
      expect(response).toEqual(updatedTicket)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledTimes(1)
      expect(mockedPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: mockedTicket.id },
        data: { assignedUserId: '2', lastUpdatedByUserId: '1' },
      })
    })
  })
})
