import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { AppError } from '../../../shared/errors/AppError';
import { IDeleteProductService } from '../domain/models/IDeleteProduct';
import { ICache } from '../../../shared/providers/models/ICache';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../../../config/upload';

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
		if (product.image) {
			const productImagePath = path.join(uploadConfig.directory, product.image);
			if (await fs.promises.stat(productImagePath))
				await fs.promises.unlink(productImagePath);
		}
		await this.cacheService.invalidate('api-vendas_PRODUCT_LIST');
		await this.productsRepository.delete(data.id);
	}
}
