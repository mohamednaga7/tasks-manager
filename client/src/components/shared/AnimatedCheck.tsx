import {
	StyledCheckMark,
	StyledCheckMarkCheck,
	StyledCheckMarkCircle,
	StyledCheckWrapper,
} from 'components/shared/SuccessComponent/Styles';
import React from 'react';

export const AnimatedCheck = () => {
	return (
		<StyledCheckWrapper>
			{' '}
			<StyledCheckMark
				className='checkmark'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 52 52'
			>
				{' '}
				<StyledCheckMarkCircle
					className='checkmark__circle'
					cx='26'
					cy='26'
					r='25'
					fill='none'
				/>{' '}
				<StyledCheckMarkCheck
					className='checkmark__check'
					fill='none'
					d='M14.1 27.2l7.1 7.2 16.7-16.8'
				/>
			</StyledCheckMark>
		</StyledCheckWrapper>
	);
};
