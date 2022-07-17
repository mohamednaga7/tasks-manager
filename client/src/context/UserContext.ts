import { createContext } from 'react';
import { User } from 'types/user.model';
import { getAuthCookie } from 'utils/auth-utils';

interface UserContextProps {
	cookie?: string | null;
	user?: User | null;
	setUser: (user: User | null) => void;
	setCookie: (cookie: string | null) => void;
}

export const UserContext = createContext<UserContextProps>({
	cookie: getAuthCookie(),
	user: null,
	setUser: () => {},
	setCookie: () => {},
});
