import { ICreateSessionData } from '../../domain/models/ICreateSessionData';
import { IReturnCreateSession } from '../../domain/models/IReturnCreateSession';

export interface IPaymentProvider {
	createSession(data: ICreateSessionData): Promise<IReturnCreateSession>;
}
