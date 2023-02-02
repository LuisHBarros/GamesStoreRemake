import { Request } from 'express';
import { inject, injectable } from 'tsyringe';
import { stripe } from '../../../config/stripe';
import { AppError } from '../../../shared/errors/AppError';
import { IDonePaymentsRepository } from '../domain/models/IDonePaymentsRepository';

@injectable()
export class webhook {
	constructor(
		@inject('DonePaymentsRepository')
		private donePaymentsRepository: IDonePaymentsRepository,
	) {}
	public async execute(req: Request) {
		let event;
		const sig = req.headers['stripe-signature'];
		const webHookSecret = process.env.WEB_HOOK_SECRET || '';
		if (!sig) throw new AppError('Signature not found');
		try {
			event = stripe.webhooks.constructEvent(
				//@ts-ignore
				req.body,
				sig,
				webHookSecret,
			);
		} catch (e: any) {
			console.log(`⚠️  Webhook signature verification failed.`, e.message);
			throw new AppError('Webhook signature verification failed.', 400);
		}
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			await this.donePaymentsRepository.updatePaymentStatus({
				//@ts-ignore
				sessionId: session.id,
				status: 'paid',
			});
		} else {
			console.log(`Unhandled event type ${event.type}`);
		}

		return { received: true };
	}
}
