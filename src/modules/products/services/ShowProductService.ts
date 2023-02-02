import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
import { IShowProductService } from '../domain/models/IShowProduct';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class ShowProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
	) {}
	public async execute(data: IShowProductService): Promise<IProduct | null> {
		const product = await this.productsRepository.findById(data.id);
		if (product === null) {
			throw new AppError('This product does not exist', 404);
		}
		return product;
	}
}
