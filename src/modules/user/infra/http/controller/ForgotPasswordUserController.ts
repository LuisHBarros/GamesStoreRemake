import { ForgotPasswordUserService } from '../../../services/ForgotPasswordUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

export class ForgotPasswordUserController {
	public async execute(req: Request, res: Response): Promise<Response> {
		const { email } = req.body;
		const user = await container
			.resolve(ForgotPasswordUserService)
			.execute({ email });
		return res.json(instanceToInstance(user));
	}
}
