import { JwtPayload, sign, verify } from 'jsonwebtoken';
import authConfig from '../../../../config/auth';
import { ITokenProvider } from '../models/ITokenProvider';
import { AppError } from '../../../../shared/errors/AppError';

export class JwbTokenProvider implements ITokenProvider {
	public createToken(subject: string): string {
		return sign({}, authConfig.token.secret, {
			subject,
			expiresIn: authConfig.token.expiresIn,
		});
	}
	public validateToken(token: string): string | JwtPayload {
		try {
			const decodedToken = verify(token, authConfig.token.secret);
			console.log(decodedToken);
			return decodedToken;
		} catch (err) {
			console.log(err);
			throw new AppError('Error on token authentication1');
		}
	}
}
