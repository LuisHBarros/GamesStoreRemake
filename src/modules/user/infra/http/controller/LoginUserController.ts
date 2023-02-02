import { LoginUserService } from '../../../services/LoginUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

export class LoginUserController {
	public async execute(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;
		const user = await container
			.resolve(LoginUserService)
			.execute({ email, password });
		return res.json(instanceToInstance(user));
	}
}
