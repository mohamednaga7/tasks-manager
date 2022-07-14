/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserSignupInput } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL mutation operation: SignupUser
// ====================================================

export interface SignupUser_signup_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface SignupUser_signup {
  __typename: "UserWithToken";
  user: SignupUser_signup_user;
}

export interface SignupUser {
  signup: SignupUser_signup;
}

export interface SignupUserVariables {
  input: UserSignupInput;
}
