import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { AppError } from '../../../shared/errors/AppError';
import { ICache } from '../../../shared/providers/models/ICache';

@injectable()
export class UpdateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: IUpdateProduct): Promise<IProduct | null> {
		const product = await this.productsRepository.findById(data.id);
		if (!product) throw new AppError('This product does not exist', 404);
		await this.cacheService.invalidate('api-vendas_PRODUCT_LIST');
		return await this.productsRepository.save(data);
	}
}
