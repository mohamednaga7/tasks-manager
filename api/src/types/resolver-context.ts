import { User } from '../modules/users/models/user.model';

export interface ResolverContext {
	req: {
		session: {
			user?: User;
		};
	};
}
