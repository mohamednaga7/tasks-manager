import { gql } from '@apollo/client';

export const getAllTicketsQuery = gql`
	query getAllTickets($skip: Float, $limit: Float) {
		tickets(skip: $skip, limit: $limit) {
			id
			title
			description
			status
			createdAt
			updatedAt
			author {
				id
				name
				email
			}
		}
	}
`;
