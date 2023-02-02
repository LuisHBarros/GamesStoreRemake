import { ShowUserService } from '../../../services/ShowUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

export class ShowUserController {
	public async execute(req: Request, res: Response): Promise<Response> {
		const showProfile = container.resolve(ShowUserService);
		const user_id = req.user.id;
		const user = await showProfile.execute({ user_id });

		return res.json(instanceToInstance(user));
	}
}
