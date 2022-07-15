import React from 'react';
import { Ticket } from 'types/ticket.model';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface Props {
	ticket: Ticket;
}

export const TicketComponent = ({ ticket }: Props) => {
	return (
		<Link
			to={`/tickets/${ticket.id}`}
			className='flex flex-col w-full border rounded-md shadow-md p-3 bg-white mb-3 gap-4 cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-300'
		>
			<h4 className='text-md w-full text-gray-800'>{ticket.title}</h4>
			<div className='flex justify-between'>
				<span className='text-gray-400'>
					{moment(ticket.createdAt).format('DD/MM/yyyy')}
				</span>
				<span className='capitalize text-gray-900 font-thin hover:font-normal transition-all duration-300'>
					{ticket.author?.name}
				</span>
			</div>
		</Link>
	);
};
