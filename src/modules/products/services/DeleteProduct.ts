import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { AppError } from '../../../shared/errors/AppError';
import { IDeleteProductService } from '../domain/models/IDeleteProduct';
import { ICache } from '../../../shared/providers/models/ICache';

@injectable()
export class DeleteProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: IDeleteProductService): Promise<void> {
		const product = await this.productsRepository.findById(data.id);
		if (!product) throw new AppError('This product does not exist', 404);
		await this.cacheService.invalidate('api-vendas_PRODUCT_LIST');
		await this.productsRepository.delete(data.id);
	}
}
