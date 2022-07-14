import { gql } from '@apollo/client';

export const signinUserMutation = gql`
	mutation SigninUser($input: UserSigninInput!) {
		signin(userSigninInput: $input) {
			user {
				id
				firstName
				lastName
				username
				email
			}
		}
	}
`;
