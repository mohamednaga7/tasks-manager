import { useMutation, useQuery } from '@apollo/client';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Input } from 'components/shared/inputs/BaseInput/Input';
import { Select } from 'components/shared/inputs/Select/Select';
import { TextArea } from 'components/shared/inputs/TextArea/TextArea';
import { UsersSelect } from 'components/UsersSelect/UsersSelect';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
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
	const [editingTitle, setEditingTitle] = useState(false);
	const [editingDescription, setEditingDescription] = useState(false);
	const [titleInputValue, setTitleInputValue] = useState<string>('');
	const [descriptionInputValue, setDescriptionInputValue] =
		useState<string>('null');

	const {
		data,
		loading: loadingTicket,
		error,
		refetch,
	} = useQuery<getTicketDetails, getTicketDetailsVariables>(
		getTicketDetailsQuery,
		{
			variables: {
				id: id!,
			},
		}
	);

	const {
		data: historyData,
		loading: historyLoading,
		error: historyError,
		refetch: historyRefetch,
	} = useQuery<getTicketHistory, getTicketHistoryVariables>(
		getTicketHistoryQuery,
		{
			variables: { ticketId: id! },
		}
	);

	useEffect(() => {
		if (data && data.ticket) {
			setTitleInputValue(data.ticket.title);
			setDescriptionInputValue(data.ticket.description);
		}
	}, [data]);

	const [submitUpdateTicket, { loading: updatingTicket }] = useMutation<
		updateTicket,
		updateTicketVariables
	>(updateTicketMutation, {
		onCompleted: () => {
			refetchAll();
		},
	});

	const loadingAny = loadingTicket || historyLoading || updatingTicket;

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

	const handleChangeTitle = () => {
		setEditingTitle(false);
		if (
			!titleInputValue ||
			loadingAny ||
			titleInputValue === data!.ticket!.title
		)
			return;
		submitUpdateTicket({
			variables: {
				ticketId: id!,
				input: {
					title: titleInputValue,
				},
			},
		});
	};

	const handleChangeDescription = () => {
		setEditingDescription(false);
		if (
			!descriptionInputValue ||
			loadingAny ||
			descriptionInputValue === data!.ticket!.description
		)
			return;
		submitUpdateTicket({
			variables: {
				ticketId: id!,
				input: {
					description: descriptionInputValue,
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

	const refetchAll = () => {
		refetch();
		historyRefetch();
	};

	return (
		<div className='py-5 px-12 w-full min-h-full'>
			{loadingTicket && <div>Loading...</div>}
			{error && <div>Error! {error.message}</div>}
			{!loadingTicket && data && (
				<div className='flex w-full min-h-full'>
					<div className='flex-grow flex flex-col justify-between'>
						<div>
							{editingTitle ? (
								<div className='max-w-6xl mb-8 mr-8'>
									<Input
										label='Title'
										type='text'
										autofocus
										disabled={loadingAny}
										value={titleInputValue}
										onChange={(e) => {
											setTitleInputValue(e.target.value);
										}}
										onBlur={handleChangeTitle}
									/>
								</div>
							) : (
								<div className='flex justify-between transition-all group mb-8 rounded-md hover:bg-gray-200 py-2 px-4 mr-4'>
									<h2 className='text-2xl tracking-wide capitalize'>
										{data.ticket.title}
									</h2>
									<button
										onClick={() => !loadingAny && setEditingTitle(true)}
										disabled={loadingAny}
										className='border-blue-700 border text-blue-700 opacity-0 rounded-full self-center w-6 h-6 group-hover:flex group-hover:opacity-100 justify-center items-center cursor-pointer hover:border-0 hover:bg-blue-700 hover:text-white transition-all'
									>
										<FontAwesomeIcon icon={faPen} fontSize='12px' />
									</button>
								</div>
							)}

							{editingDescription ? (
								<div className='max-w-6xl mr-8 '>
									<TextArea
										label='Description'
										value={descriptionInputValue}
										autofocus
										disabled={loadingAny}
										onChange={(e) => {
											setDescriptionInputValue(e.target.value);
										}}
										onBlur={handleChangeDescription}
									/>
								</div>
							) : (
								<div className='flex justify-between transition-all group rounded-md hover:bg-gray-200 py-2 px-4 mr-4'>
									<p className='text-lg text-gray-700'>
										{data.ticket.description}
									</p>
									<button
										onClick={() => !loadingAny && setEditingDescription(true)}
										disabled={loadingAny}
										className='border-blue-700 border text-blue-700 opacity-0 rounded-full self-center w-6 h-6 group-hover:flex group-hover:opacity-100 justify-center items-center cursor-pointer hover:border-0 hover:bg-blue-700 hover:text-white transition-all'
									>
										<FontAwesomeIcon icon={faPen} fontSize='12px' />
									</button>
								</div>
							)}
						</div>

						<div>
							<hr />
							<h3 className='font-bold tracking-wide my-5'>Ticket Changes</h3>
							<div className='flex flex-col gap-1 h-80 overflow-y-scroll'>
								{historyLoading && <div>Fetching History...</div>}
								{!historyLoading && historyData && (
									<table className='mr-8'>
										<tbody>
											{historyData?.ticketHistory.map((historyItem, index) => (
												<tr
													key={historyItem.id}
													className={(index % 2 === 0 && 'bg-gray-100') || ''}
												>
													<td className='p-3'>
														<span className='text-blue-700 capitalize cursor-pointer'>
															{historyItem.updatingUser.name}
														</span>{' '}
														<span>{historyItem.message}</span>
													</td>
													<td>
														<span className='text-gray-500 text-sm'>
															{moment(historyItem.createdAt).format(
																'DD/MM/YYYY - hh:mm a'
															)}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
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
								disabled={loadingAny}
							/>
						</div>
						<hr />
						<div className='flex flex-col mb-4 mt-4'>
							<span>Assigned User</span>
							<UsersSelect
								value={data.ticket.assignedUser?.id || ''}
								onChange={handleChangeAssignedUser}
								disabled={loadingAny}
							/>
						</div>
						<hr />
						<div className='flex flex-col mb-4 mt-4'>
							<span className='text-gray-500'>
								Created{' '}
								<span className='ml-2 text-gray-800'>
									{moment(data.ticket.createdAt).format('DD/MM/YYYY - hh:mm a')}
								</span>
								<br />
								by{' '}
								<span className='text-gray-900 font-bold capitalize'>
									{data.ticket.author.name}
								</span>
							</span>
							{data.ticket.lastUpdatedByUser && (
								<>
									<span className='mt-5 text-gray-500'>
										Updated{' '}
										<span className='ml-2 text-gray-800'>
											{moment(data.ticket.updatedAt).format(
												'DD/MM/YYYY - hh:mm a'
											)}
										</span>
										<br />
										by{' '}
										<span className='text-gray-900 font-bold capitalize'>
											{data.ticket.lastUpdatedByUser.name}
										</span>
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TicketDetailsPage;
