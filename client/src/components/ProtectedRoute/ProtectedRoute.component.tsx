import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
	cookie?: string | null;
}

export const ProtectedRoute = ({ cookie }: Props) => {
	return cookie ? <Outlet /> : <Navigate to='/signin' />;
};

export const UnAuthenticatedRoute = ({ cookie }: Props) => {
	return cookie ? <Navigate to='/' /> : <Outlet />;
};
