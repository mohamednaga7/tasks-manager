/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTicketInput, TicketStatus } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL mutation operation: addNewTicket
// ====================================================

export interface addNewTicket_createTicket_assignedUser {
  __typename: "User";
  id: string;
  name: string;
}

export interface addNewTicket_createTicket {
  __typename: "Ticket";
  id: string;
  title: string;
  status: TicketStatus;
  description: string;
  assignedUser: addNewTicket_createTicket_assignedUser | null;
}

export interface addNewTicket {
  createTicket: addNewTicket_createTicket;
}

export interface addNewTicketVariables {
  input: CreateTicketInput;
}
