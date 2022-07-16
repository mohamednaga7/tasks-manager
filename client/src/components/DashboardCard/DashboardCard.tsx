import React from 'react';

interface Props {
	title: string;
	value: number;
	onClick: () => void;
}

export const DashboardCard = ({ title, value, onClick }: Props) => {
	return (
		<div
			className='last-of-type:border-0 border-r min-w-[11rem] flex-grow py-3 pl-2 px-5 cursor-pointer transition-all duration-300 group'
			onClick={onClick}
		>
			<h4 className='text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-all duration-300 mb-8'>
				{title}
			</h4>
			<div className='flex justify-between items-center'>
				<span className='text-gray-800 group-hover:text-blue-700 transition-all duration-300 text-4xl font-extrabold'>
					{value}
				</span>
				<span className='text-gray-800 group-hover:text-blue-700 transition-all duration-300 text-xl'>
					Ticket{value !== 1 && 's'}
				</span>
			</div>
		</div>
	);
};
