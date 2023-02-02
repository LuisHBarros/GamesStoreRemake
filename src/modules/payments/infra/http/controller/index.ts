import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSessionService } from '../../../services/createSessionService';
import { ListUserPaymentsService } from '../../../services/listUserPayments';
import { webhook } from '../../../services/StripeWebHook';
export class CreateCheckoutController {
	public async createSessions(req: Request, res: Response): Promise<Response> {
		const user_id = req.user.id;
		const service = container.resolve(CreateSessionService);
		const response = await service.execute(req.body, user_id);
		return res.json(instanceToInstance(response));
	}
	public async webHook(req: Request, res: Response): Promise<Response> {
		const service = container.resolve(webhook);
		const response = await service.execute(req);
		return res.json(instanceToInstance(response));
	}
	public async listUserPayments(
		req: Request,
		res: Response,
	): Promise<Response> {
		const service = container.resolve(ListUserPaymentsService);
		const response = await service.execute(req.user.id);
		return res.json(instanceToInstance(response));
	}
}
