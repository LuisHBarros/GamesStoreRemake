import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { ICache } from '../../../shared/providers/models/ICache';
import { AppError } from '../../../shared/errors/AppError';
import DiskStorageProvider from '../../../shared/providers/StorageProvider/DiskStorageProvider';
import uploadConfig from '../../../config/upload';
import S3StorageProvider from '../../../shared/providers/StorageProvider/S3StorageProvider';

@injectable()
export class CreateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductRepository,
		@inject('CacheService')
		private cacheService: ICache,
	) {}
	public async execute(data: ICreateProduct): Promise<IProduct> {
		var fileName = '';
		if (await this.productsRepository.findByName(data.name))
			throw new AppError('name already in use', 500);

			await this.cacheService.invalidate('api-vendas-PRODUCT_LIST');
			if (uploadConfig.driver === 's3') {
					const storageProvider = new S3StorageProvider()
					fileName = await storageProvider.saveFile(data.image);
			}
			else {
				const storageProvider = new DiskStorageProvider()
        fileName = await storageProvider.saveFile(data.image);
			}
			const product = await this.productsRepository.create({
				name: data.name,
				description: data.description,
				price: Number(data.price),
				stock: Number(data.stock),
				image: fileName,
			});
			return product;
	}
}
