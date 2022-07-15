import { useQuery } from '@apollo/client';
import { BoardColumn } from 'components/BoardColumn/BoardColumn.component';
import React from 'react';
import { TicketStatus } from 'types/ticket-status.model';
import { getAllTicketsQuery } from './api';
import {
	getAllTickets,
	getAllTicketsVariables,
} from './__generated__/getAllTickets';

export const BoardPage = () => {
	const { data, loading } = useQuery<getAllTickets, getAllTicketsVariables>(
		getAllTicketsQuery,
		{
			variables: {
				limit: 100,
			},
		}
	);
	return (
		<div className='w-full overflow-x-scroll'>
			<div className='flex gap-6 py-5 px-4 min-w-max h-screen'>
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
	);
};

export default BoardPage;
