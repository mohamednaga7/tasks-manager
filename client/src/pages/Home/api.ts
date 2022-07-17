import { gql } from '@apollo/client';

export const getTicketsAnalyticsQuery = gql`
	query TicketsAnalytics {
		ticketsAnalytics {
			totalTickets
			todoTickets
			inProgressTickets
			blockedTickets
			inQaTickets
			doneTickets
			deployedTickets
		}
	}
`;
