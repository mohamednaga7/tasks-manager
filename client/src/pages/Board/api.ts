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
			}
			assignedUser {
				id
				name
			}
		}
	}
`;

export const createNewTicketMutation = gql`
	mutation addNewTicket($input: CreateTicketInput!) {
		createTicket(input: $input) {
			id
			title
			status
			description
			assignedUser {
				id
				name
			}
		}
	}
`;
