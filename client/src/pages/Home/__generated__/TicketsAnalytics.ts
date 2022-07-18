/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TicketsAnalytics
// ====================================================

export interface TicketsAnalytics_ticketsAnalytics {
  __typename: "TicketsAnalytics";
  totalTicketsCount: number;
  todoTicketsCount: number;
  inProgressTicketsCount: number;
  blockedTicketsCount: number;
  inQaTicketsCount: number;
  doneTicketsCount: number;
  deployedTicketsCount: number;
}

export interface TicketsAnalytics {
  ticketsAnalytics: TicketsAnalytics_ticketsAnalytics;
}
