/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTicketHistory
// ====================================================

export interface getTicketHistory_ticketHistory_updatingUser {
  __typename: "User";
  id: string;
  name: string;
}

export interface getTicketHistory_ticketHistory {
  __typename: "TicketHistory";
  id: string;
  message: string;
  updatingUser: getTicketHistory_ticketHistory_updatingUser;
  createdAt: any;
}

export interface getTicketHistory {
  ticketHistory: getTicketHistory_ticketHistory[];
}

export interface getTicketHistoryVariables {
  ticketId: string;
}
