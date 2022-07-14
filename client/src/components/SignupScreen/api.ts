import { gql } from '@apollo/client';

export const signupUserMutation = gql`
	mutation SignupUser($input: UserSignupInput!) {
		signup(userSignupInput: $input) {
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
