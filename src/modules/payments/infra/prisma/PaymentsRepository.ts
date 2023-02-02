import { PrismaClient, DonePayments } from '@prisma/client';
import { ICreateDonePayments } from '../../domain/models/ICreateDonePayments';
import { IDonePayments } from '../../domain/models/IDonePayments';
import { IDonePaymentsRepository } from '../../domain/models/IDonePaymentsRepository';
import { IUpdatePaymentStatus } from '../../domain/models/IUpdatePaymentStatus';

export default class DonePaymentsRepository implements IDonePaymentsRepository {
	private prisma = new PrismaClient();
	public async findAll(): Promise<DonePayments[]> {
		return await this.prisma.donePayments.findMany();
	}
	public async findByCustomerEmail(email: string): Promise<DonePayments[]> {
		return await this.prisma.donePayments.findMany({
			where: {
				customer_email: email,
			},
		});
	}
	public async findById(id: string): Promise<DonePayments | null> {
		return await this.prisma.donePayments.findUnique({ where: { id } });
	}
	public async create(data: ICreateDonePayments): Promise<DonePayments> {
		return await this.prisma.donePayments.create({
			data: {
				session_id: data.sessionId,
				customer_email: data.customer_email,
				customer_name: data.customer_name,
				payment_status: data.payment_status,
				subtotal: data.subtotal,
				total: data.total,
				products: data.products,
			},
		});
	}
	public async updatePaymentStatus(
		data: IUpdatePaymentStatus,
	): Promise<IDonePayments | null> {
		return await this.prisma.donePayments.update({
			where: {
				session_id: data.sessionId,
			},
			data: {
				payment_status: data.status,
				paid_at: new Date(),
			},
		});
	}
}
