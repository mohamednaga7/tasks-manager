import React from 'react';
import { Input } from 'components/shared/inputs/BaseInput/Input';
import { Formik } from 'formik';
import { SignupUser, SignupUserVariables } from './__generated__/SignupUser';
import { signupUserMutation } from './api';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Success } from '../shared/SuccessComponent/Success.component';
import { useNavigate } from 'react-router-dom';

export const SignupComponent = () => {
	const navigate = useNavigate();
	const [submitUserSignup, { error, data }] = useMutation<
		SignupUser,
		SignupUserVariables
	>(signupUserMutation);

	if (data) {
		return <Success text='Successfully Registered' />;
	}

	return (
		<div>
			{error && <ErrorMessage title='Signup Error' body={error.message} />}
			<Formik
				initialValues={{
					firstName: '',
					lastName: '',
					username: '',
					email: '',
					password: '',
				}}
				validate={(values) => {
					const errors: {
						firstName?: string;
						lastName?: string;
						username?: string;
						email?: string;
						password?: string;
					} = {};
					if (!values.email) {
						errors.email = 'Email is required';
					} else if (
						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
					) {
						errors.email = 'Invalid email address';
					}
					if (!values.firstName) {
						errors.firstName = 'First Name is required';
					}
					if (!values.lastName) {
						errors.lastName = 'Last Name is required';
					}
					if (!values.username) {
						errors.username = 'Username is required';
					}
					if (!values.password) {
						errors.password = 'Password is required';
					}
					if (values.password.length < 6) {
						errors.password = 'Password should be at least 6 characters long';
					}
					return errors;
				}}
				onSubmit={async (input) => {
					const { data } = await submitUserSignup({
						variables: { input },
					});
					if (data) {
						setTimeout(() => {
							navigate('/signin');
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
							name='firstName'
							label='First Name'
							onChange={handleChange}
							disabled={isSubmitting}
							autofocus
							onBlur={handleBlur}
							value={values.firstName}
							error={
								(errors.firstName && touched.firstName && errors.firstName) ||
								undefined
							}
						/>
						<Input
							type='text'
							name='lastName'
							label='Last Name'
							onChange={handleChange}
							disabled={isSubmitting}
							onBlur={handleBlur}
							value={values.lastName}
							error={
								(errors.lastName && touched.lastName && errors.lastName) ||
								undefined
							}
						/>
						<Input
							type='text'
							name='username'
							label='Username'
							onChange={handleChange}
							disabled={isSubmitting}
							onBlur={handleBlur}
							value={values.username}
							error={
								(errors.username && touched.username && errors.username) ||
								undefined
							}
						/>
						<Input
							type='email'
							name='email'
							label='Email'
							onChange={handleChange}
							disabled={isSubmitting}
							onBlur={handleBlur}
							value={values.email}
							error={
								(errors.email && touched.email && errors.email) || undefined
							}
						/>
						<Input
							type='password'
							name='password'
							label='Password'
							onChange={handleChange}
							disabled={isSubmitting}
							onBlur={handleBlur}
							value={values.password}
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
							{isSubmitting ? 'Submitting...' : 'Sign up'}
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
};
