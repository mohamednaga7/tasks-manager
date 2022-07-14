import React, { useContext } from 'react';
import { SigninComponent } from 'components/SigninScreen/Signin.component';
import { SignupComponent } from 'components/SignupScreen/Signup.component';
import { UserContext } from 'context/UserContext';

export enum AuthPageType {
	SIGNIN,
	SIGNUP,
}

interface Props {
	type: AuthPageType;
}

export const AuthPage = ({ type }: Props) => {
	const userContext = useContext(UserContext);
	return (
		<div className='w-full bg-blue-600 flex items-center justify-center min-h-screen py-16'>
			<div className='w-11/12 max-w-screen-md bg-white py-16 px-12 shadow-sm'>
				<h2 className='uppercase text-4xl mb-9 text-center text-blue-700 font-bold'>
					{type === AuthPageType.SIGNIN ? 'Sign in' : 'Sign up'}
				</h2>
				{type === AuthPageType.SIGNIN ? (
					<SigninComponent setUser={userContext.setUser} />
				) : (
					<SignupComponent />
				)}
			</div>
		</div>
	);
};
