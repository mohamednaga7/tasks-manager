/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TicketsAnalytics
// ====================================================

export interface TicketsAnalytics_ticketsAnalytics {
  __typename: "TicketsAnalytics";
  totalTickets: number;
  todoTickets: number;
  inProgressTickets: number;
  blockedTickets: number;
  inQaTickets: number;
  doneTickets: number;
  deployedTickets: number;
}

export interface TicketsAnalytics {
  ticketsAnalytics: TicketsAnalytics_ticketsAnalytics;
}
