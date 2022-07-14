import { AnimatedCheck } from 'components/shared/AnimatedCheck';
import React from 'react';

export const Success = ({ text }: { text: string }) => {
	return (
		<div>
			<AnimatedCheck />
			<p className='text-center text-green-600 font-thin text-3xl tracking-wider'>
				{text}
			</p>
		</div>
	);
};
