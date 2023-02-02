import { IDonePayments } from './IDonePayments';
import { ICreateDonePayments } from './ICreateDonePayments';
import { IUpdatePaymentStatus } from './IUpdatePaymentStatus';

export interface IDonePaymentsRepository {
	create(data: ICreateDonePayments): Promise<IDonePayments>;
	findByCustomerEmail(email: string): Promise<IDonePayments[] | null>;
	findById(id: string): Promise<IDonePayments | null>;
	updatePaymentStatus(
		data: IUpdatePaymentStatus,
	): Promise<IDonePayments | null>;
}
