import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/AppError';
import { IProductRepository } from '../../products/domain/repositories/IProductsRepository';
import { IUsersRepository } from '../../user/domain/repositories/IUsersRepository';
import { ICreateSession } from '../domain/models/ICreateSession';
import { IDonePaymentsRepository } from '../domain/models/IDonePaymentsRepository';
import { ILine_items } from '../domain/models/ILineItems';
import { IProductWithQuantity } from '../domain/models/IProductWithQuantity';
import { IPaymentProvider } from '../providers/models/IPaymentProvider';

@injectable()
export class CreateSessionService {
	constructor(
		@inject('ProductsRepository')
		private productRepository: IProductRepository,
		@inject('DonePaymentsRepository')
		private DonePaymentsRepository: IDonePaymentsRepository,
		@inject('UsersRepository')
		private userRepository: IUsersRepository,
		@inject('PaymentProvider')
		private paymentProvider: IPaymentProvider,
	) {}
	public async execute(data: ICreateSession, user_id: string): Promise<any> {
		const line_items = await Promise.all(
			data.products.map(async product => {
				var p = await this.search(product).then(function (results) {
					return results;
				});
				return p;
			}),
		);
		const user = await this.userRepository.findById(user_id);
		if (!user) {
			throw new AppError('User not found', 404);
		}
		setTimeout(() => {}, 100);

		try {
			const session = await this.paymentProvider.createSession({
				customer_email: user.email,
				payment_method: ['card'],
				line_items,
				mode: 'payment',
				success_url: 'https://www.google.com/',
				cancel_url: 'https://br.yahoo.com/',
			});
			const productsAndPrices = line_items.map(p => {
				return `name: ${p.price_data.product_data.name}, price: ${p.price_data.unit_amount}, quantity: ${p.quantity} `;
			});

			this.DonePaymentsRepository.create({
				sessionId: session.id,
				customer_email: user.email,
				customer_name: user.name,
				payment_status: 'pending',
				products: productsAndPrices,
				subtotal: session.amount_subtotal || 0,
				total: session.amount_total || 0,
			});
			return session;
		} catch (error: any) {
			console.log(error);
			throw new AppError(error);
		}
	}
	private async search(data: IProductWithQuantity): Promise<ILine_items> {
		var product = await this.productRepository.findById(data.id);
		if (!product) throw new AppError('product not found', 404);
		if (data.quantity > product.stock)
			throw new AppError('we not have enough stock for this quantity', 500);
		await this.productRepository.save({
			id: product.id,
			stock: product.stock - data.quantity,
			description: product.description,
			image: product.image,
			name: product.name,
			price: product.price,
		});
		return {
			price_data: {
				currency: 'BRL',
				product_data: {
					name: product.name,
					images: [product.image],
					description: product.description,
				},
				unit_amount: product.price * 100,
			},
			quantity: data.quantity,
		};
	}
}
