import { useQuery } from '@apollo/client';
import { Select } from 'components/shared/inputs/Select/Select';
import React, { useMemo } from 'react';
import { getUsersQuery } from './api';
import { getUsers } from './__generated__/getUsers';

interface Props {
	value: string;
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
			value={value}
			emptyLabel='Unassigned'
			options={usersOptions || []}
			onChange={onChange}
			disabled={disabled}
		/>
	);
};
