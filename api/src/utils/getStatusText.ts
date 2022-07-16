import { TicketStatus } from '@prisma/client'

export const getStatusText = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.TODO:
      return 'To Do'
    case TicketStatus.IN_PROGRESS:
      return 'In Progress'
    case TicketStatus.BLOCKED:
      return 'Blocked'
    case TicketStatus.IN_QA:
      return 'In QA'
    case TicketStatus.DONE:
      return 'Done'
    case TicketStatus.DEPLOYED:
      return 'Deployed'
    default:
      return ''
  }
}
