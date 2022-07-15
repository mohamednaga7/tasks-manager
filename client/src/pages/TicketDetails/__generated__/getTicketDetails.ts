/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TicketStatus } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL query operation: getTicketDetails
// ====================================================

export interface getTicketDetails_ticket_author {
  __typename: "User";
  id: string;
  name: string;
}

export interface getTicketDetails_ticket_lastUpdatedByUser {
  __typename: "User";
  id: string;
  name: string;
}

export interface getTicketDetails_ticket {
  __typename: "Ticket";
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  author: getTicketDetails_ticket_author;
  lastUpdatedByUser: getTicketDetails_ticket_lastUpdatedByUser | null;
  createdAt: any;
  updatedAt: any;
}

export interface getTicketDetails {
  ticket: getTicketDetails_ticket;
}

export interface getTicketDetailsVariables {
  id: string;
}
