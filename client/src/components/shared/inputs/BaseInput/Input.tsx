import React, { HTMLInputTypeAttribute } from 'react';

interface Props {
	type: HTMLInputTypeAttribute;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	name?: string;
	id?: string;
	className?: string;
	onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
	error?: string;
	label?: string;
	disabled?: boolean;
}

export const Input = React.forwardRef(({ error, ...props }: Props) => {
	return (
		<div className='flex flex-col relative items-start w-full'>
			<label
				htmlFor={props.id || props.name}
				className='text-gray-600 absolute -top-2 left-6 bg-white px-2 lowercase text-sm font-medium'
			>
				{props.label}
			</label>
			<input
				id={props.id || props.name}
				{...props}
				className={`py-3 px-5 w-full rounded-md border-2 focus:border-blue-700 outline-none disabled:bg-gray-100 ${
					error && 'border-red-500'
				}`}
			/>
			{error && <span className='text-red-600'>{error}</span>}
		</div>
	);
});
