import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthPageType } from 'pages/Auth/Auth.page';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute.component';
import { UserContext } from 'context/UserContext';
import { User } from 'types/user.model';
import Cookies from 'js-cookie';
import { useLazyQuery } from '@apollo/client';
import { getCurrentUserQuery } from './api';
import { GetCurrentUser } from './__generated__/GetCurrentUser';
import { LoadingScreen } from 'components/LoadingScreen/LoadingScreen';
import { Layout } from 'components/Layout/Layout';

const HomePage = React.lazy(() => import('pages/Home/Home.page'));
const AuthPage = React.lazy(() => import('pages/Auth/Auth.page'));
const BoardPage = React.lazy(() => import('pages/Board/Board.page'));
const TicketDetailsPage = React.lazy(
	() => import('pages/TicketDetails/TicketDetails.page')
);

function App() {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const authCookie = useMemo(() => Cookies.get('sid'), [user]);

	const [getCurrentuser, { loading, error }] = useLazyQuery<GetCurrentUser>(
		getCurrentUserQuery,
		{
			notifyOnNetworkStatusChange: true,
		}
	);

	useEffect(() => {
		if (authCookie) {
			(async () => {
				const { data } = await getCurrentuser();
				if (data && data.me) {
					setUser(data.me);
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (error && authCookie) {
			Cookies.remove('sid');
			setUser(null);
			navigate('/signin', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, authCookie]);

	return (
		<UserContext.Provider value={{ user, setUser, cookie: authCookie }}>
			<div className='min-h-screen'>
				{true ? (
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
							element={
								<React.Suspense fallback={<LoadingScreen />}>
									<AuthPage type={AuthPageType.SIGNIN} />
								</React.Suspense>
							}
						/>
						<Route
							path='/signup'
							element={
								<React.Suspense fallback={<LoadingScreen />}>
									<AuthPage type={AuthPageType.SIGNUP} />
								</React.Suspense>
							}
						/>
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
