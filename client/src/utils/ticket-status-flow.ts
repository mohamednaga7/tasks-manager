import { TicketStatus } from 'types/ticket-status.model';

export const getAvailableTicketStatusChanges = (
	currentStatus?: TicketStatus
): TicketStatus[] => {
	switch (currentStatus) {
		case TicketStatus.TODO:
			return [TicketStatus.IN_PROGRESS];
		case TicketStatus.IN_PROGRESS:
			return [TicketStatus.BLOCKED, TicketStatus.IN_QA];
		case TicketStatus.BLOCKED:
			return [TicketStatus.TODO];
		case TicketStatus.IN_QA:
			return [TicketStatus.DONE, TicketStatus.TODO];
		case TicketStatus.DONE:
			return [TicketStatus.DEPLOYED];
		default:
			return [];
	}
};
