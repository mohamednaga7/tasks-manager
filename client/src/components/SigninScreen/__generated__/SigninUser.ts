/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserSigninInput } from "./../../../__graphql__/globalTypes";

// ====================================================
// GraphQL mutation operation: SigninUser
// ====================================================

export interface SigninUser_signin_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface SigninUser_signin {
  __typename: "UserWithToken";
  user: SigninUser_signin_user;
}

export interface SigninUser {
  signin: SigninUser_signin;
}

export interface SigninUserVariables {
  input: UserSigninInput;
}
