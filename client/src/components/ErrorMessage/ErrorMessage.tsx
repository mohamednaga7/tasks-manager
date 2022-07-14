import React from 'react';
import { Spring, animated } from 'react-spring';

interface Props {
	title: string;
	body: string;
}

export const ErrorMessage = ({ title, body }: Props) => {
	return (
		<Spring
			config={{ duration: 300 }}
			from={{ transform: 'scale(0)' }}
			to={{ transform: 'scale(1)' }}
		>
			{(animatedStyles) => (
				<animated.div
					style={animatedStyles}
					className='flex flex-col bg-red-300 py-4 px-6 rounded-sm border overflow-hidden border-red-400 mb-8'
				>
					<h4 className='text-white text-md font-bold mb-3'>{title}</h4>
					<p className='text-white text-sm'>{body}</p>
				</animated.div>
			)}
		</Spring>
	);
};
