import { useMutation } from '@apollo/client';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Input } from 'components/shared/inputs/BaseInput/Input';
import { Success } from 'components/shared/SuccessComponent/Success.component';
import { Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'types/user.model';
import { signinUserMutation } from './api';
import { SigninUser, SigninUserVariables } from './__generated__/SigninUser';

interface Props {
	setUser: (user: User | null) => void;
}

export const SigninComponent = ({ setUser }: Props) => {
	const navigate = useNavigate();
	const [submitUserSignin, { error, data }] = useMutation<
		SigninUser,
		SigninUserVariables
	>(signinUserMutation);

	if (data) {
		return <Success text='Sign In Successfull' />;
	}
	return (
		<div>
			{error && (
				<ErrorMessage
					title='Signin Error'
					body={
						error.message === 'Failed to fetch'
							? 'Error Signing in, please try again later'
							: error.message
					}
				/>
			)}
			<Formik
				initialValues={{
					emailOrUsername: '',
					password: '',
				}}
				validate={(values) => {
					const errors: { emailOrUsername?: string; password?: string } = {};
					if (!values.emailOrUsername) {
						errors.emailOrUsername = 'Email / Username is Required';
					}
					if (!values.password) {
						errors.password = 'Password is Required';
					}
					if (values.password.length < 6) {
						errors.password = 'Password should be at least 6 characters long';
					}
					return errors;
				}}
				onSubmit={async (input) => {
					const { data } = await submitUserSignin({ variables: { input } });

					if (data) {
						setTimeout(() => {
							setUser(data.signin.user);
							navigate('/');
						}, 1500);
					}
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<form onSubmit={handleSubmit} className='flex flex-col gap-8 w-full'>
						<Input
							type='text'
							name='emailOrUsername'
							label='Email / Username'
							autofocus
							onChange={handleChange}
							onBlur={handleBlur}
							disabled={isSubmitting}
							value={values.emailOrUsername}
							error={
								(errors.emailOrUsername &&
									touched.emailOrUsername &&
									errors.emailOrUsername) ||
								undefined
							}
						/>
						<Input
							type='password'
							name='password'
							label='Password'
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.password}
							disabled={isSubmitting}
							error={
								(errors.password && touched.password && errors.password) ||
								undefined
							}
						/>

						<button
							className='bg-blue-700 text-xl uppercase cursor-pointer font-semibold text-white py-3 px-5 rounded-sm disabled:bg-blue-200'
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Signin'}
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
};
