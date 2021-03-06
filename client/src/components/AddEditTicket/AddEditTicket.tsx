import { useMutation } from '@apollo/client';
import { Modal } from 'components/Modal/Modal';
import { Input } from 'components/shared/inputs/BaseInput/Input';
import { TextArea } from 'components/shared/inputs/TextArea/TextArea';
import { UsersSelect } from 'components/UsersSelect/UsersSelect';
import { Formik } from 'formik';
import { createNewTicketMutation } from 'pages/Board/api';
import {
	addNewTicket,
	addNewTicketVariables,
} from 'pages/Board/__generated__/addNewTicket';
import React, { useState } from 'react';

interface Props {
	onClose: () => void;
	refetch: () => void;
}

export const AddEditTicket = ({ onClose, refetch }: Props) => {
	const [selectedUser, setSelectedUser] = useState<string>('');

	const [handleSubmitNewTicket] = useMutation<
		addNewTicket,
		addNewTicketVariables
	>(createNewTicketMutation);

	const handleAddTicket = async (input: addNewTicketVariables) => {
		const { data } = await await handleSubmitNewTicket({
			variables: input,
		});
		if (data?.createTicket) {
			return true;
		}
		return false;
	};

	return (
		<Modal title={'Add Ticket'} onClose={onClose}>
			<Formik
				initialValues={{
					title: '',
					description: '',
					assignedUserId: selectedUser,
				}}
				validate={(values) => {
					const errors: { title?: string; description?: string } = {};
					if (!values.title) {
						errors.title = 'Title is Required';
					}
					if (!values.description) {
						errors.description = 'Description is Required';
					}

					return errors;
				}}
				onSubmit={async (input) => {
					const responseSuccessful = await handleAddTicket({
						input: { ...input, assignedUserId: selectedUser },
					});

					if (responseSuccessful) {
						refetch();
						onClose();
					}
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<form
						onSubmit={handleSubmit}
						className='flex flex-col gap-8 w-full h-full'
					>
						<Input
							type='text'
							name='title'
							label='Title'
							autofocus
							onChange={handleChange}
							onBlur={handleBlur}
							disabled={isSubmitting}
							value={values.title}
							error={
								(errors.title && touched.title && errors.title) || undefined
							}
						/>
						<TextArea
							name='description'
							label='Description'
							onChange={handleChange}
							onBlur={handleBlur}
							disabled={isSubmitting}
							value={values.description}
							error={
								(errors.description &&
									touched.description &&
									errors.description) ||
								undefined
							}
						/>
						<UsersSelect
							value={selectedUser || ''}
							onChange={setSelectedUser}
						/>

						<div className='self-end'>
							<button
								type='button'
								onClick={onClose}
								className='border-blue-700 border-2 text-md uppercase cursor-pointer font-semibold shadow-sm shadow-gray-200 text-blue-700 py-2 px-4 rounded-sm disabled:bg-blue-200 mr-4'
							>
								Cancel
							</button>

							<button
								className='bg-blue-700 text-md uppercase cursor-pointer font-semibold shadow-sm shadow-gray-200 text-white py-2 px-4 rounded-sm disabled:bg-blue-200'
								type='submit'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Submitting...' : 'Add Ticket'}
							</button>
						</div>
					</form>
				)}
			</Formik>
		</Modal>
	);
};
