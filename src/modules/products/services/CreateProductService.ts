import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { ICache } from '../../../shared/providers/models/ICache';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class CreateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: ICreateProduct): Promise<IProduct> {
		if (await this.productsRepository.findByName(data.name))
			throw new AppError('name already in use', 500);

		try {
			await this.cacheService.invalidate('api-vendas-PRODUCT_LIST');
			const product = await this.productsRepository.create({
				name: data.name,
				description: data.description,
				price: Number(data.price),
				stock: Number(data.stock),
				image: data.image,
			});
			return product;
		} catch (error) {
			throw new AppError('' + error);
		}
	}
}
