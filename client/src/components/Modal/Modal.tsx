import React from 'react';

interface Props extends React.PropsWithChildren {
	title: string;
	onClose: () => void;
}

export const Modal = ({ children, title, onClose }: Props) => {
	return (
		<div
			className='flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-opacity-80 bg-gray-800 z-40'
			onClick={onClose}
		>
			<div className='min-w-[45rem] min-h-[35rem] bg-white rounded-md shadow-md shadow-gray-900 p-4' onClick={(e) => e.stopPropagation()}>
				<div className='pb-3 pl-4'>
					<h3 className='text-3xl tracking-widest capitalize'>{title}</h3>
				</div>
				<hr className='mb-4' />
				{children}
			</div>
		</div>
	);
};
