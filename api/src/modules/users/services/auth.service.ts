import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class AuthService {
	generateJWTToken(payload: any) {
		return sign(payload, process.env.JWT_SECRET!);
	}

	getUserFromToken(token: string) {
		return verify(token, process.env.JWT_SECRET!);
	}

	hashUserPassword(password: string) {
		return hash(password, 12);
	}

	compareUserPassword(password: string, hashedPassword: string) {
		return compare(password, hashedPassword);
	}
}
