/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum TicketStatus {
  BLOCKED = "BLOCKED",
  DEPLOYED = "DEPLOYED",
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  IN_QA = "IN_QA",
  TODO = "TODO",
}

export interface UpdateTicketInput {
  assigneeId?: string | null;
  description?: string | null;
  status?: TicketStatus | null;
  title?: string | null;
}

export interface UserSigninInput {
  emailOrUsername: string;
  password: string;
}

export interface UserSignupInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
