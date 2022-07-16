import { TicketComponent } from 'components/Ticket/Ticket.component';
import React from 'react';
import { TicketStatus } from 'types/ticket-status.model';
import { Ticket } from 'types/ticket.model';
import { filterTicketsByStatus } from 'utils/filterTicketsByStatus';

interface Props {
	title: string;
	loading: boolean;
	tickets?: Ticket[];
	status: TicketStatus;
}

export const BoardColumn = ({ tickets, loading, title, status }: Props) => {
	const ticketsList = tickets ? (
		filterTicketsByStatus(tickets, status).map((ticket) => (
			<TicketComponent ticket={ticket} key={ticket.id} />
		))
	) : (
		<h4 className='text-center'>
			{loading ? 'Loading...' : 'No Tickets Here'}
		</h4>
	);
	return (
		<div className='flex flex-col w-80 h-full'>
			<div className='bg-gray-200 shadow-sm shadow-gray-300 py-4 px-5 mb-3'>
				<h4>{title}</h4>
			</div>

			<div className='flex flex-col bg-gray-100 rounded-sm shadow-md shadow-gray-300 p-4 h-full'>
				{ticketsList}
			</div>
		</div>
	);
};
