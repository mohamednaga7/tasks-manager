import { useQuery } from '@apollo/client';
import { Select } from 'components/shared/inputs/Select/Select';
import { getUsersQuery } from 'pages/TicketDetails/api';
import { getUsers } from 'pages/TicketDetails/__generated__/getUsers';
import React, { useMemo } from 'react';

interface Props {
	value?: string;
	onChange: (selectedUser: string) => void;
	disabled?: boolean;
}

export const UsersSelect = ({ value, onChange, disabled }: Props) => {
	const { data: usersData } = useQuery<getUsers>(getUsersQuery);

	const usersOptions = useMemo(
		() =>
			usersData?.users.map((user) => ({ value: user.id, label: user.name })),
		[usersData]
	);

	return (
		<Select
			value={value || ''}
			emptyLabel='Unassigned'
			options={usersOptions || []}
			onChange={onChange}
			disabled={disabled}
		/>
	);
};
