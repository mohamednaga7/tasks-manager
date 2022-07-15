import { useMutation, useQuery } from '@apollo/client';
import { Select } from 'components/shared/inputs/Select/Select';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TicketStatus } from 'types/ticket-status.model';
import { getStatusText } from 'utils/getStatusText';
import { getAvailableTicketStatusChanges } from 'utils/ticket-status-flow';
import { getTicketDetailsQuery, updateTicketMutation } from './api';
import {
	getTicketDetails,
	getTicketDetailsVariables,
} from './__generated__/getTicketDetails';
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

	const [submitUpdateTicket] = useMutation<updateTicket, updateTicketVariables>(
		updateTicketMutation,
		{
			onCompleted: () => {
				refetch();
			},
		}
	);

	const handleChangeStatus = (newStatus: TicketStatus) => {
		console.log('clicked', newStatus, id);
		submitUpdateTicket({
			variables: {
				ticketId: id!,
				input: {
					status: newStatus,
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
		<div className='py-5 px-12 w-full'>
			{loading && <div>Loading...</div>}
			{error && <div>Error! {error.message}</div>}
			{!loading && data && (
				<div className='flex w-full'>
					<div className='flex-grow'>
						<h2 className='text-2xl tracking-wide mb-8 capitalize'>
							{data.ticket.title}
						</h2>

						<p className='text-lg text-gray-700'>{data.ticket.description}</p>
					</div>
					<div className='border-l h-screen w-96 px-4'>
						<div className='flex flex-col'>
							<span>Ticket Status</span>
							<Select
								value={data.ticket.status}
								options={statusOptions || []}
								onChange={handleChangeStatus}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
