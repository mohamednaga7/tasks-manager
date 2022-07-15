import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthPage, AuthPageType } from 'pages/Auth/Auth.page';
import { Boardpage } from 'pages/Board/Board.page';
import { HomePage } from 'pages/Home/Home.page';
import { ProtectedRoute } from 'components/ProtectedRoute/ProtectedRoute.component';
import { UserContext } from 'context/UserContext';
import { User } from 'types/user.model';
import Cookies from 'js-cookie';
import { useLazyQuery } from '@apollo/client';
import { getCurrentUserQuery } from './api';
import { GetCurrentUser } from './__generated__/GetCurrentUser';
import { LoadingScreen } from 'components/LoadingScreen/LoadingScreen';
import { TicketDetailsPage } from 'pages/TicketDetails/TicketDetails.page';
import { Layout } from 'components/Layout/Layout';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const authCookie = useMemo(() => Cookies.get('sid'), [user]);

	const [getCurrentuser, { loading, data: currentUserResponse, error }] =
		useLazyQuery<GetCurrentUser>(getCurrentUserQuery, {
			notifyOnNetworkStatusChange: true,
		});

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

	useEffect(() => {
		if (currentUserResponse) {
			setUser(currentUserResponse.me);
		}
	}, [currentUserResponse]);

	return (
		<UserContext.Provider value={{ user, setUser, cookie: authCookie }}>
			<>
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
							<Route path='/' element={<HomePage />} />
						</Route>
						<Route
							path='/signin'
							element={<AuthPage type={AuthPageType.SIGNIN} />}
						/>
						<Route
							path='/signup'
							element={<AuthPage type={AuthPageType.SIGNUP} />}
						/>
						<Route
							path='/board'
							element={
								<Layout>
									<ProtectedRoute cookie={authCookie} />
								</Layout>
							}
						>
							<Route path='/board' element={<Boardpage />} />
						</Route>
						<Route
							path='/tickets/:id'
							element={
								<Layout>
									<ProtectedRoute cookie={authCookie} />
								</Layout>
							}
						>
							<Route path='/tickets/:id' element={<TicketDetailsPage />} />
						</Route>
						<Route path='/*' element={<Navigate to='/' replace />} />
					</Routes>
				)}
			</>
		</UserContext.Provider>
	);
}

export default App;
