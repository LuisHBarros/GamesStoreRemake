import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../../../../modules/user/infra/prisma/UsersRepository';
import { AppError } from '../../../errors/AppError';

export class isAdministrator {
	constructor() {}
	public async execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userRepository = new UsersRepository();
		const user = await userRepository.findById(req.user.id);
		if (user?.adm === false) {
			throw new AppError('You are not a administrator!', 401);
		}
		return next();
	}
}
