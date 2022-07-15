/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTicketInput, TicketStatus } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateTicket
// ====================================================

export interface updateTicket_updateTicket_author {
  __typename: "User";
  id: string;
  name: string;
}

export interface updateTicket_updateTicket_lastUpdatedByUser {
  __typename: "User";
  id: string;
  name: string;
}

export interface updateTicket_updateTicket {
  __typename: "Ticket";
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  author: updateTicket_updateTicket_author;
  lastUpdatedByUser: updateTicket_updateTicket_lastUpdatedByUser | null;
  createdAt: any;
  updatedAt: any;
}

export interface updateTicket {
  updateTicket: updateTicket_updateTicket;
}

export interface updateTicketVariables {
  ticketId: string;
  input: UpdateTicketInput;
}
