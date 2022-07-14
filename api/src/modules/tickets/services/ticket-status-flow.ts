import { TicketStatus } from '@prisma/client'

export const ticketStatusFlow = {
  [TicketStatus.TODO]: [TicketStatus.IN_PROGRESS],
  [TicketStatus.IN_PROGRESS]: [TicketStatus.BLOCKED, TicketStatus.IN_QA],
  [TicketStatus.BLOCKED]: [TicketStatus.TODO],
  [TicketStatus.IN_QA]: [TicketStatus.DONE, TicketStatus.TODO],
  [TicketStatus.DONE]: [TicketStatus.DEPLOYED],
}
