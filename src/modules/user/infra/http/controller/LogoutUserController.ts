import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '../../../../../shared/errors/AppError';
import { LogoutUserService } from '../../../services/LogoutUserService';

export class LogoutUserController {
	public async execute(req: Request, res: Response) {
		const service = container.resolve(LogoutUserService);
		const authHeader = req.headers.authorization;
		if (!authHeader) throw new AppError('Missing authorization header', 401);
		const [, token] = authHeader.split(' ');
		const id = '';
		const response = await service.execute(token, id);
		return res.json(instanceToInstance(response));
	}
}
