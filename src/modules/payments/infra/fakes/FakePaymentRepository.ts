import { ICreateDonePayments } from '../../domain/models/ICreateDonePayments';
import { v4 as uuid } from 'uuid';
import { IDonePayments } from '../../domain/models/IDonePayments';
import { IDonePaymentsRepository } from '../../domain/models/IDonePaymentsRepository';
import { IUpdatePaymentStatus } from '../../domain/models/IUpdatePaymentStatus';

export class FakeDonePaymentsRepository implements IDonePaymentsRepository {
	private payments: IDonePayments[] = [];
	async create(data: ICreateDonePayments): Promise<IDonePayments> {
		const donePayment = {
			id: await uuid(),
			customer_email: data.customer_email,
			customer_name: data.customer_name,
			payment_status: data.payment_status,
			subtotal: data.subtotal,
			total: data.total,
			products: data.products,
			created_at: new Date(),
			paid_at: null,
		};
		this.payments.push(donePayment);
		return donePayment;
	}
	async findByCustomerEmail(email: string): Promise<IDonePayments[] | null> {
		const p = this.payments.map(pay => {
			if (pay.customer_email === email) return pay;
		});
		//@ts-ignore
		return p;
	}
	async findById(id: string): Promise<IDonePayments | null> {
		throw new Error('not implemented');
	}
	async updatePaymentStatus(
		data: IUpdatePaymentStatus,
	): Promise<IDonePayments | null> {
		throw new Error('not implemented');
	}
}
