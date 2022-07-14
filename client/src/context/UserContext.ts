import { createContext } from 'react';
import { User } from 'types/user.model';

interface UserContextProps {
	cookie?: string | null;
	user?: User | null;
	setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps>({
	cookie: null,
	user: null,
	setUser: () => {},
});
