import { useQuery } from '@apollo/client';
import { AddEditTicket } from 'components/AddEditTicket/AddEditTicket';
import { BoardColumn } from 'components/BoardColumn/BoardColumn.component';
import React, { useState } from 'react';
import { TicketStatus } from 'types/ticket-status.model';
import { getAllTicketsQuery } from './api';
import {
	getAllTickets,
	getAllTicketsVariables,
} from './__generated__/getAllTickets';

export const BoardPage = () => {
	const [showAddTicket, setShowAddTicket] = useState(false);
	const { data, loading, refetch } = useQuery<
		getAllTickets,
		getAllTicketsVariables
	>(getAllTicketsQuery, {
		variables: {
			limit: 100,
		},
	});
	return (
		<div className='w-full pt-5 px-4 overflow-x-scroll h-screen flex flex-col'>
			{showAddTicket && (
				<AddEditTicket
					onClose={() => setShowAddTicket(false)}
					refetch={refetch}
				/>
			)}
			<div className='flex justify-between mb-4 items-center'>
				<h4 className='text-lg'>
					Total of <span className='font-bold'>{data?.tickets.length}</span>{' '}
					tickets
				</h4>
				<button
					onClick={() => {
						setShowAddTicket(true);
					}}
					className='py-3 px-5 bg-blue-700 rounded-sm text-white cursor-pointer shadow-md shadow-gray-400 hover:bg-blue-800 hover:shadow-gray-300'
				>
					Add Ticket
				</button>
			</div>
			<div className='w-full flex-grow overflow-x-scroll'>
				<div className='flex gap-6  min-w-max h-full'>
					<BoardColumn
						status={TicketStatus.TODO}
						loading={loading}
						title='Todo'
						tickets={data?.tickets}
					/>

					<BoardColumn
						status={TicketStatus.IN_PROGRESS}
						loading={loading}
						title='In Progress'
						tickets={data?.tickets}
					/>

					<BoardColumn
						status={TicketStatus.BLOCKED}
						loading={loading}
						title='Blocked'
						tickets={data?.tickets}
					/>

					<BoardColumn
						status={TicketStatus.IN_QA}
						loading={loading}
						title='In QA'
						tickets={data?.tickets}
					/>

					<BoardColumn
						status={TicketStatus.DONE}
						loading={loading}
						title='Done'
						tickets={data?.tickets}
					/>

					<BoardColumn
						status={TicketStatus.DEPLOYED}
						loading={loading}
						title='Deployed'
						tickets={data?.tickets}
					/>
				</div>
			</div>
		</div>
	);
};

export default BoardPage;
