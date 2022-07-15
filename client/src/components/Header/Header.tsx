import { CustomNavLink } from 'components/CustomNavLink/CustomNavLink';
import React from 'react';

export const Header = () => {
	return (
		<div className='bg-blue-700 flex flex-col justify-between h-screen mr-1'>
			<nav className='flex flex-col'>
				<CustomNavLink to='/'>Home</CustomNavLink>
				<CustomNavLink to='/board'>Board</CustomNavLink>
			</nav>

			<div></div>
		</div>
	);
};
