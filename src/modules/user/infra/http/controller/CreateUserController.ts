import { CreateUserService } from '../../../services/CreateUserService';
import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

export class CreateUserController {
	public async execute(req: Request, res: Response): Promise<Response> {
		if (!req.body.adm) req.body.adm = false;
		const { email, name, password, adm } = req.body;
		const createUser = container.resolve(CreateUserService);

		const user = await createUser.execute({ name, email, password, adm });

		return res.json(instanceToInstance(user)).status(201);
	}
}
