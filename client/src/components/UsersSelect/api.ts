import { gql } from '@apollo/client';

export const getUsersQuery = gql`
	query getUsers {
		users {
			id
			name
		}
	}
`;
