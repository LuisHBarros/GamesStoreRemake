import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
import { ICache } from '../../../shared/providers/models/ICache';

@injectable()
export class ListProductsService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(): Promise<IProduct[]> {
		let products = await this.cacheService.recover<IProduct[]>(
			'api-vendas-PRODUCT_LIST',
		);
		if (!products) {
			products = await this.productsRepository.findAll();
			await this.cacheService.save('api-vendas-PRODUCT_LIST', products);
		}
		return products;
	}
}
