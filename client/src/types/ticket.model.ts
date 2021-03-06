import { TicketStatus } from './ticket-status.model';
import { User } from './user.model';

export interface Ticket {
	readonly id: string;

	title: string;

	description?: string;

	status?: TicketStatus;

	author?: User;

	assignedUserId?: string | null;

	assignedUser?: User | null;

	createdAt?: Date;

	updatedAt?: Date;

	closedAt?: Date | null;
}
