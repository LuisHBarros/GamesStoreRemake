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

		if (!authHeader) {
			throw new AppError('JTW Token is missing.');
		}

		const [, token]: string[] = authHeader.split(' ');

		try {
			const decodedToken = verify(token, authConfig.token.secret);
			const { sub } = decodedToken as ITokenPayload;

			req.user = {
				id: sub,
			};
			if (await search(`${token}-${req.user.id}`))
				throw new Error('Token on blacklist');
			return next();
		} catch (e) {
			throw new AppError(`${e}`, 401);
		}
	}
}

//
