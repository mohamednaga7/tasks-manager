import { useQuery } from '@apollo/client';
import { DashboardCard } from 'components/DashboardCard/DashboardCard';
import { UserContext } from 'context/UserContext';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTicketsAnalyticsQuery } from './api';
import { TicketsAnalytics } from './__generated__/TicketsAnalytics';

export const HomePage = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const {
		data: ticketAnalytics,
		loading: loadingTickets,
		error: errorTickets,
	} = useQuery<TicketsAnalytics>(getTicketsAnalyticsQuery);

	const navigateToBoard = () => navigate('/board');
	return (
		<div className='p-12 w-full'>
			<h2 className='text-4xl font-bold capitalize text-gray-800'>
				Welcome, {user?.name}
			</h2>
			<div className='mt-8 w-full'>
				{!loadingTickets && errorTickets && <div>Error fetching data</div>}
				{loadingTickets && <div>Loading Analytics...</div>}
				{!loadingTickets && !errorTickets && ticketAnalytics && (
					<>
						<h2 className='mb-6'>
							You have a total of{' '}
							<strong>{ticketAnalytics.ticketsAnalytics.totalTickets}</strong>{' '}
							tickets
						</h2>
						<h3 className='text-2xl mb-4'>Summary</h3>
						<hr className='mb-6' />
						<div className='flex gap-5 flex-wrap w-full'>
							<DashboardCard
								onClick={navigateToBoard}
								title='To Do'
								value={ticketAnalytics.ticketsAnalytics.todoTickets}
							/>

							<DashboardCard
								onClick={navigateToBoard}
								title='In Progress'
								value={ticketAnalytics.ticketsAnalytics.inProgressTickets}
							/>
							<DashboardCard
								onClick={navigateToBoard}
								title='Blocked'
								value={ticketAnalytics.ticketsAnalytics.blockedTickets}
							/>
							<DashboardCard
								onClick={navigateToBoard}
								title='In QA'
								value={ticketAnalytics.ticketsAnalytics.inQaTickets}
							/>
							<DashboardCard
								onClick={navigateToBoard}
								title='Done'
								value={ticketAnalytics.ticketsAnalytics.doneTickets}
							/>
							<DashboardCard
								onClick={navigateToBoard}
								title='Deployed'
								value={ticketAnalytics.ticketsAnalytics.deployedTickets}
							/>
						</div>
						<hr className='my-6' />
					</>
				)}
			</div>
		</div>
	);
};

export default HomePage;
