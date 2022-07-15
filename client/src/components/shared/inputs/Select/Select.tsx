import React, { useCallback, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { TicketStatus } from 'types/ticket-status.model';

interface Props {
	value: string;
	onChange: (value: TicketStatus) => void;
	options?: { value: TicketStatus; label: string }[];
}

export const Select = ({ value, options, onChange }: Props) => {
	const [showList, setShowList] = useState(true);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, () => setShowList(false));
	const handleChange = (selectedValue: TicketStatus) => () => {
		if (value === selectedValue) {
			return;
		}
		onChange(selectedValue);
		setShowList(false);
	};
	return (
		<div className='w-96 flex flex-col relative' ref={wrapperRef}>
			<div
				className='bg-gray-200 py-2 px-4 rounded-lg flex justify-between cursor-pointer items-center hover:bg-gray-300'
				onClick={() => {
					setShowList(true);
				}}
			>
				<span>
					{options &&
						options.length &&
						options.find((option) => option.value === value)?.label}
				</span>
				<FontAwesomeIcon icon={faChevronDown} />
			</div>
			<div
				className={`absolute top-full flex mt-4 flex-col overflow-y-hidden w-96 border rounded-md transition-all duration-300 ${
					showList
						? 'max-h-[19rem] opacity-100 visible'
						: 'h-0 opacity-0 hidden'
				}`}
			>
				{options &&
					options.length &&
					options.map((option) => (
						<>
							<div
								key={option.value}
								className={`py-3 px-4 ${
									option.value !== value
										? 'cursor-pointer hover:bg-blue-100'
										: 'bg-gray-100 text-gray-400'
								}`}
								onClick={handleChange(option.value)}
							>
								{option.label}
							</div>
							<hr />
						</>
					))}
			</div>
		</div>
	);
};
