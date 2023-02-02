import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { ICache } from '../../../shared/providers/models/ICache';

@injectable()
export class CreateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: ICreateProduct): Promise<IProduct> {
		await this.cacheService.invalidate('api-vendas_PRODUCT_LIST');
		return this.productsRepository.create(data);
	}
}
