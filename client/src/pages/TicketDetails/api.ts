import { gql } from '@apollo/client';

export const getTicketDetailsQuery = gql`
	query getTicketDetails($id: String!) {
		ticket(ticketId: $id) {
			id
			title
			description
			status
			assignedUserId
			author {
				id
				name
			}
			lastUpdatedByUser {
				id
				name
			}
			assignedUser {
				id
				name
			}
			createdAt
			updatedAt
		}
	}
`;

export const updateTicketMutation = gql`
	mutation updateTicket($ticketId: String!, $input: UpdateTicketInput!) {
		updateTicket(ticketId: $ticketId, input: $input) {
			id
			title
			description
			status
			author {
				id
				name
			}
			lastUpdatedByUser {
				id
				name
			}
			createdAt
			updatedAt
		}
	}
`;

export const getTicketHistoryQuery = gql`
	query getTicketHistory($ticketId: String!) {
		ticketHistory(ticketId: $ticketId) {
			id
			message
			updatingUser {
				id
				name
			}
			createdAt
		}
	}
`;
