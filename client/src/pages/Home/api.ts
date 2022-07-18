import { gql } from '@apollo/client';

export const getTicketsAnalyticsQuery = gql`
	query TicketsAnalytics {
		ticketsAnalytics {
			totalTicketsCount
			todoTicketsCount
			inProgressTicketsCount
			blockedTicketsCount
			inQaTicketsCount
			doneTicketsCount
			deployedTicketsCount
		}
	}
`;
