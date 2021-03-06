import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthPageType } from 'pages/Auth/Auth.page';
import {
	ProtectedRoute,
	UnAuthenticatedRoute,
} from 'components/ProtectedRoute/ProtectedRoute.component';
import { UserContext } from 'context/UserContext';
import { User } from 'types/user.model';
import { useLazyQuery } from '@apollo/client';
import { getCurrentUserQuery } from './api';
import { GetCurrentUser } from './__generated__/GetCurrentUser';
import { LoadingScreen } from 'components/LoadingScreen/LoadingScreen';
import { Layout } from 'components/Layout/Layout';
import { clearAuthCookie, getAuthCookie } from 'utils/auth-utils';

const HomePage = React.lazy(() => import('pages/Home/Home.page'));
const AuthPage = React.lazy(() => import('pages/Auth/Auth.page'));
const BoardPage = React.lazy(() => import('pages/Board/Board.page'));
const TicketDetailsPage = React.lazy(
	() => import('pages/TicketDetails/TicketDetails.page')
);

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [authCookie, setAuthCookie] = useState<string | null>(
		getAuthCookie() || null
	);
	const navigate = useNavigate();

	const [getCurrentuser, { loading }] = useLazyQuery<GetCurrentUser>(
		getCurrentUserQuery,
		{
			notifyOnNetworkStatusChange: true,
			fetchPolicy: 'no-cache',
		}
	);

	useEffect(() => {
		if (authCookie) {
			(async () => {
				const { data, error } = await getCurrentuser();
				if (error && error.message !== 'Failed to fetch') {
					clearAuthCookie();
					setAuthCookie(null);
					setUser(null);
					navigate('/signin', { replace: true });
				}
				if (data && data.me) {
					setUser(data.me);
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<UserContext.Provider
			value={{ user, setUser, cookie: authCookie, setCookie: setAuthCookie }}
		>
			<div className='min-h-screen'>
				{loading && !user && authCookie ? (
					<LoadingScreen />
				) : (
					<Routes>
						<Route
							path='/'
							element={
								<Layout>
									<ProtectedRoute cookie={authCookie} />
								</Layout>
							}
						>
							<Route
								path='/'
								element={
									<React.Suspense fallback={<LoadingScreen />}>
										<HomePage />
									</React.Suspense>
								}
							/>
						</Route>
						<Route
							path='/signin'
							element={<UnAuthenticatedRoute cookie={authCookie} />}
						>
							<Route
								path='/signin'
								element={
									<React.Suspense fallback={<LoadingScreen />}>
										<AuthPage type={AuthPageType.SIGNIN} />
									</React.Suspense>
								}
							/>
						</Route>
						<Route
							path='/signup'
							element={<UnAuthenticatedRoute cookie={authCookie} />}
						>
							<Route
								path='/signup'
								element={
									<React.Suspense fallback={<LoadingScreen />}>
										<AuthPage type={AuthPageType.SIGNUP} />
									</React.Suspense>
								}
							/>
						</Route>
						<Route
							path='/board'
							element={
								<Layout>
									<ProtectedRoute cookie={authCookie} />
								</Layout>
							}
						>
							<Route
								path='/board'
								element={
									<React.Suspense fallback={<LoadingScreen />}>
										<BoardPage />
									</React.Suspense>
								}
							/>
						</Route>
						<Route
							path='/tickets/:id'
							element={
								<Layout>
									<ProtectedRoute cookie={authCookie} />
								</Layout>
							}
						>
							<Route
								path='/tickets/:id'
								element={
									<React.Suspense fallback={<LoadingScreen />}>
										<TicketDetailsPage />
									</React.Suspense>
								}
							/>
						</Route>
						<Route path='/*' element={<Navigate to='/' replace />} />
					</Routes>
				)}
			</div>
		</UserContext.Provider>
	);
}

export default App;
