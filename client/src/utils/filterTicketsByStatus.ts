import { TicketStatus } from 'types/ticket-status.model';
import { Ticket } from 'types/ticket.model';

export const filterTicketsByStatus = (
	tickets: Ticket[],
	status: TicketStatus
): Ticket[] => {
	return tickets.filter((ticket) => ticket.status === status);
};
