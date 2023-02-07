import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { AppError } from '../../../shared/errors/AppError';
import { ICache } from '../../../shared/providers/models/ICache';
import uploadConfig from '../../../config/upload';
import path from 'path';
import fs from 'fs';

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
		if (data.image) {
			const productImagePath = path.join(uploadConfig.directory, data.image);
			if (await fs.promises.stat(productImagePath))
				await fs.promises.unlink(productImagePath);
		}
		await this.cacheService.invalidate('api-vendas_PRODUCT_LIST');
		if(data.image === '') data.image = product.image
		return await this.productsRepository.save({
			id: data.id,
			stock: data.stock,
			description: data.description,
			image: data.image,
			name: data.name,
			price: data.price,
		});;
	}
}
