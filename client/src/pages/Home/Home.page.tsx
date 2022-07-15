import { useQuery } from '@apollo/client';
import { DashboardCard } from 'components/DashboardCard/DashboardCard';
import { UserContext } from 'context/UserContext';
import { getAllTicketsQuery } from 'pages/Board/api';
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketStatus } from 'types/ticket-status.model';
import { Ticket } from 'types/ticket.model';

export const HomePage = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const {
		data: ticketsData,
		loading: loadingTickets,
		error: errorTickets,
	} = useQuery(getAllTicketsQuery);

	const todoTickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.TODO
			),
		[ticketsData]
	);
	const inProgressTickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.IN_PROGRESS
			),
		[ticketsData]
	);
	const blockedTickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.BLOCKED
			),
		[ticketsData]
	);
	const inQATickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.IN_QA
			),
		[ticketsData]
	);
	const doneTickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.DONE
			),
		[ticketsData]
	);
	const deployedTickets = useMemo(
		() =>
			ticketsData?.tickets.filter(
				(ticket: Ticket) => ticket.status === TicketStatus.DEPLOYED
			),
		[ticketsData]
	);
	const navigateToBoard = () => navigate('/board');
	return (
		<div className='p-12'>
			<h2 className='text-4xl font-bold capitalize text-gray-800'>
				Welcome, {user?.name}
			</h2>
			<div className='mt-8'>
				<h3 className='text-2xl mb-4'>Summary</h3>
				<hr className='mb-6' />
				<div className='flex gap-5 flex-wrap'>
					<DashboardCard
						onClick={navigateToBoard}
						title='To Do'
						value={todoTickets?.length}
					/>

					<DashboardCard
						onClick={navigateToBoard}
						title='In Progress'
						value={inProgressTickets?.length}
					/>
					<DashboardCard
						onClick={navigateToBoard}
						title='Blocked'
						value={blockedTickets?.length}
					/>
					<DashboardCard
						onClick={navigateToBoard}
						title='In QA'
						value={inQATickets?.length}
					/>
					<DashboardCard
						onClick={navigateToBoard}
						title='Done'
						value={doneTickets?.length}
					/>
					<DashboardCard
						onClick={navigateToBoard}
						title='Deployed'
						value={deployedTickets?.length}
					/>
				</div>
				<hr className='my-6' />
			</div>
		</div>
	);
};

export default HomePage;
