import { ResetUserPasswordService } from '../../../services/ResetUserPasswordService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

export class ResetUserPasswordController {
	public async execute(req: Request, res: Response): Promise<Response> {
		const { resetToken, password } = req.body;
		const user = await container
			.resolve(ResetUserPasswordService)
			.execute({ resetToken, password });
		return res.json(instanceToInstance(user));
	}
}
