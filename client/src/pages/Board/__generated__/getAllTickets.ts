/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TicketStatus } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL query operation: getAllTickets
// ====================================================

export interface getAllTickets_tickets_author {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface getAllTickets_tickets {
  __typename: "Ticket";
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: any;
  updatedAt: any;
  author: getAllTickets_tickets_author;
}

export interface getAllTickets {
  tickets: getAllTickets_tickets[];
}

export interface getAllTicketsVariables {
  skip?: number | null;
  limit?: number | null;
}
