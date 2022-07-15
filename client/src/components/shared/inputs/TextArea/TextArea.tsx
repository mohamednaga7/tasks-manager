import React from 'react';

interface Props {
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	name?: string;
	id?: string;
	onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
	error?: string;
	label?: string;
	disabled?: boolean;
	autofocus?: boolean;
}

export const TextArea = ({ label, autofocus, error, ...props }: Props) => {
	return (
		<div>
			<label
				htmlFor='message'
				className='text-sm pl-2 font-medium text-gray-900'
			>
				{label}
			</label>
			<textarea
				rows={4}
				id={props.id || props.name}
				autoFocus={autofocus}
				{...props}
				className={`p-2.5 mt-2 w-full text-sm  text-gray-900 rounded-lg border-2 focus:border-blue-700 outline-none disabled:bg-gray-100 ${
					error && 'border-red-500'
				}`}
			></textarea>
		</div>
	);
};
