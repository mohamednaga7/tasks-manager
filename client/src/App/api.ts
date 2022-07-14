import { gql } from '@apollo/client';

export const getCurrentUserQuery = gql`
	query GetCurrentUser {
		me {
			id
			email
			name
			username
		}
	}
`;
