import { Header } from 'components/Header/Header';
import React from 'react';

export const Layout = ({ children }: React.PropsWithChildren) => {
	return (
		<div className='flex'>
			<Header />
			{children}
		</div>
	);
};
