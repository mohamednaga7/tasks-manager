import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';

export const CustomNavLink = ({ children, to, ...props }: LinkProps) => {
	let resolved = useResolvedPath(to);
	let match = useMatch({ path: resolved.pathname, end: true });

	return (
		<>
			<Link
				className={`text-white cursor-pointer transition-all duration-300 hover:text-gray-300 py-4 text-center w-44 ${
					match && 'bg-white text-gray-900'
				}`}
				to={to}
				{...props}
			>
				{children}
			</Link>
			<hr />
		</>
	);
};
