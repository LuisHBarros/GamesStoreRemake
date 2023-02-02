import { stripe } from '../../../../config/stripe';
import { ICreateSessionData } from '../../domain/models/ICreateSessionData';
import { IReturnCreateSession } from '../../domain/models/IReturnCreateSession';
import { IPaymentProvider } from '../models/IPaymentProvider';

export class StripeProvider implements IPaymentProvider {
	async createSession(data: ICreateSessionData): Promise<IReturnCreateSession> {
		return await stripe.checkout.sessions.create({
			customer_email: data.customer_email,
			payment_method_types: data.payment_method,
			line_items: data.line_items,
			mode: data.mode,
			success_url: data.success_url,
			cancel_url: data.cancel_url,
		});
	}
}
