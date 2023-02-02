import { ICreateSessionData } from '../../domain/models/ICreateSessionData';
import { IReturnCreateSession } from '../../domain/models/IReturnCreateSession';
import { IPaymentProvider } from '../models/IPaymentProvider';
import { v4 as uuid } from 'uuid';

export class FakePaymentProvider implements IPaymentProvider {
	async createSession(data: ICreateSessionData): Promise<IReturnCreateSession> {
		return {
			id: uuid(),
			url: 'www.any.com',
			amount_subtotal: 5,
			amount_total: 5,
		};
	}
}
