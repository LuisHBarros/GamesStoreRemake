import { AppError } from '../../../errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../../config/auth';
import { search } from '../../../../modules/user/providers/implementations/BlackListRedisProvider';

interface ITokenPayload {
	iat: number;
	exp: number;
	sub: string;
}
export class isAuthenticated {
	public async execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const authHeader = req.headers.authorization;
		if (!authHeader) throw new AppError('Missing authorization header', 401);
		const [, token] = authHeader.split(' ');
		// console.log('achou o token');
		try {
			const decodedToken = verify(token, authConfig.token.secret);
			console.log('verificou o token');
			const { sub } = decodedToken as ITokenPayload;
			req.user = {
				id: sub,
			};
			const blacklist = await search(`${'token'}-${'user_id'}`);
			console.log(blacklist);
			if (blacklist === token) {
				throw Error('Token in blacklist');
			}
			return next();
		} catch (e) {
			throw new AppError('' + e, 401);
		}
	}
}

//
