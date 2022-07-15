import { TicketStatus } from './ticket-status.model';
import { User } from './user.model';

export interface Ticket {
	readonly id?: string;

	title?: string;

	description?: string;

	status?: TicketStatus;

	author?: User;

	assigneeId?: string;

	createdAt?: Date;

	updatedAt?: Date;

	closedAt?: Date | null;
}
