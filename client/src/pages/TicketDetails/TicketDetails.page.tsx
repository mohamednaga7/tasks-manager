import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Select } from 'components/shared/inputs/Select/Select';
import { UsersSelect } from 'components/UsersSelect/UsersSelect';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TicketStatus } from 'types/ticket-status.model';
import { getStatusText } from 'utils/getStatusText';
import { getAvailableTicketStatusChanges } from 'utils/ticket-status-flow';
import {
	getTicketDetailsQuery,
	getTicketHistoryQuery,
	updateTicketMutation,
} from './api';
import {
	getTicketDetails,
	getTicketDetailsVariables,
} from './__generated__/getTicketDetails';
import {
	getTicketHistory,
	getTicketHistoryVariables,
} from './__generated__/getTicketHistory';
import {
	updateTicket,
	updateTicketVariables,
} from './__generated__/updateTicket';

export const TicketDetailsPage = () => {
	const { id } = useParams();

	const { data, loading, error, refetch } = useQuery<
		getTicketDetails,
		getTicketDetailsVariables
	>(getTicketDetailsQuery, {
		variables: {
			id: id!,
		},
	});

	const {
		data: historyData,
		loading: historyLoading,
		error: historyError,
	} = useQuery<getTicketHistory, getTicketHistoryVariables>(
		getTicketHistoryQuery,
		{
			variables: { ticketId: id! },
		}
	);

	const [submitUpdateTicket] = useMutation<updateTicket, updateTicketVariables>(
		updateTicketMutation,
		{
			onCompleted: () => {
				refetch();
			},
		}
	);

	const handleChangeStatus = (newStatus: string) => {
		submitUpdateTicket({
			variables: {
				ticketId: id!,
				input: {
					status: newStatus as TicketStatus,
				},
			},
		});
	};

	const handleChangeAssignedUser = (newAssignedUserId: string) => {
		submitUpdateTicket({
			variables: {
				ticketId: id!,
				input: {
					assignedUserId: newAssignedUserId,
				},
			},
		});
	};

	const statusOptions = useMemo(
		() =>
			data
				? [
						{
							value: data?.ticket.status,
							label: getStatusText(data?.ticket.status),
						},
						...getAvailableTicketStatusChanges(data?.ticket.status).map(
							(status) => ({
								value: status,
								label: getStatusText(status),
							})
						),
				  ]
				: [],
		[data]
	);

	return (
		<div className='py-5 px-12 w-full min-h-full'>
			{loading && <div>Loading...</div>}
			{error && <div>Error! {error.message}</div>}
			{!loading && data && (
				<div className='flex w-full min-h-full'>
					<div className='flex-grow flex flex-col justify-between'>
						<div>
							<h2 className='text-2xl tracking-wide mb-8 capitalize'>
								{data.ticket.title}
							</h2>

							<p className='text-lg text-gray-700'>{data.ticket.description}</p>
						</div>

						<div>
							<hr />
							<h3 className='font-bold tracking-wide my-5'>Ticket Changes</h3>
							<div className='flex flex-col gap-1 h-80 overflow-y-scroll'>
								{historyLoading && <div>Fetching History...</div>}
								{!historyLoading &&
									historyData &&
									historyData?.ticketHistory.map((historyItem) => (
										<div className='mb-3' key={historyItem.id}>
											<span className='text-blue-700 capitalize cursor-pointer'>
												{historyItem.updatingUser.name}
											</span>{' '}
											{historyItem.message}
										</div>
									))}
								{!historyLoading && !historyData && (
									<div>No History Records Found</div>
								)}
								{!historyLoading && historyError && (
									<ErrorMessage
										title='Error Fetching History'
										body='An error occurred while fetching the ticket changes history'
									/>
								)}
							</div>
						</div>
					</div>
					<div className='border-l min-h-full w-96 px-4'>
						<div className='flex flex-col mb-4'>
							<span>Ticket Status</span>
							<Select
								value={data.ticket.status}
								options={statusOptions || []}
								onChange={handleChangeStatus}
								emptyLabel='Select a status'
							/>
						</div>
						<hr />
						<div className='flex flex-col mb-4 mt-4'>
							<span>Assigned User</span>
							<UsersSelect
								value={data.ticket.assignedUser?.id || ''}
								onChange={handleChangeAssignedUser}
							/>
						</div>
						<hr />
						<div className='flex flex-col mb-4 mt-4'>
							<span>
								Ticket created at:{' '}
								<span className='ml-2 text-gray-500 font-bold'>
									{moment(data.ticket.createdAt).format('DD/MM/YYYY - hh:mm')}
								</span>
							</span>
							<span className='mt-5'>
								Ticket updated at:{' '}
								<span className='ml-2 text-gray-500 font-bold'>
									{moment(data.ticket.updatedAt).format('DD/MM/YYYY - hh:mm')}
								</span>
							</span>
							<span className='mt-5'>
								Last updated by:{' '}
								<span className='ml-2 capitalize text-gray-600 font-bold'>
									{data.ticket.lastUpdatedByUser?.name}
								</span>
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TicketDetailsPage;
