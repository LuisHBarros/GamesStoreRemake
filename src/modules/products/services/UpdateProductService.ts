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
import DiskStorageProvider from '../../../shared/providers/StorageProvider/DiskStorageProvider';
import S3StorageProvider from '../../../shared/providers/StorageProvider/S3StorageProvider';
@injectable()
export class UpdateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: IUpdateProduct): Promise<IProduct | null> {
		var fileName = '';
		const product = await this.productsRepository.findById(data.id);
		if (!product) throw new AppError('This product does not exist', 404);
		await this.cacheService.invalidate('api-vendas-PRODUCT_LIST');
		if (uploadConfig.driver === 's3') {
			const storageProvider = new S3StorageProvider();
			await storageProvider.deleteFile(product.image);
			fileName = await storageProvider.saveFile(data.image);
		} else {
			const storageProvider = new DiskStorageProvider();
			await storageProvider.deleteFile(product.image);
			fileName = await storageProvider.saveFile(data.image);
		}
		console.log('All right!', fileName);
		return await this.productsRepository.save({
			id: data.id,
			stock: Number(data.stock),
			description: data.description,
			image: fileName,
			name: data.name,
			price: Number(data.price),
		});
	}
}
