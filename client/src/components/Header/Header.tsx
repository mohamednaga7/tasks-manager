import { CustomNavLink } from 'components/CustomNavLink/CustomNavLink';
import { UserContext } from 'context/UserContext';
import Cookies from 'js-cookie';
import React, { useContext } from 'react';

export const Header = () => {
	const { user, setUser } = useContext(UserContext);

	const handleLogout = () => {
		// eslint-disable-next-line no-restricted-globals
		Cookies.remove(`${window.location.origin}-sid`);
		setUser(null);
	};

	return (
		<div className='bg-blue-700 flex flex-col justify-between h-screen shadow-md shadow-gray-400 pb-4'>
			<nav className='flex flex-col'>
				<CustomNavLink to='/'>Home</CustomNavLink>
				<CustomNavLink to='/board'>Board</CustomNavLink>
			</nav>

			<div className='flex flex-col justify-center items-center'>
				<span className='capitalize text-white text-center'>{user?.name}</span>
				<button
					onClick={handleLogout}
					className='text-white cursor-pointer transition-all duration-300 hover:text-gray-300 py-4 text-center w-44'
				>
					Logout
				</button>
			</div>
		</div>
	);
};
