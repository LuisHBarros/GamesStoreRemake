import { IProductRepository } from '../../domain/repositories/IProductsRepository';
import { PrismaClient, Product } from '@prisma/client';
import { IProduct } from '../../domain/models/IProduct';
import { AppError } from '../../../../shared/errors/AppError';

export default class ProductsRepository implements IProductRepository {
	private prisma = new PrismaClient();

	public async findAll(): Promise<IProduct[]> {
		return await this.prisma.product.findMany();
	}
	public async save(dataProducts: IProduct): Promise<Product | null> {
		console.log(dataProducts);
		return await this.prisma.product
			.update({
				where: { id: dataProducts.id },
				data: dataProducts,
			})
			.catch(e => {
				throw new Error('Error on save', e);
			});
	}
	public async findById(id: string): Promise<IProduct | null> {
		return await this.prisma.product.findFirst({ where: { id: id } });
	}
	public async create(dataProducts: IProduct): Promise<IProduct> {
		return await this.prisma.product.create({
			data: dataProducts,
		});
	}
	public async delete(id: string): Promise<void> {
		await this.prisma.product.delete({ where: { id: id } });
	}
	public async findByName(name: string): Promise<IProduct | null> {
		return await this.prisma.product.findFirst({ where: { name: name } });
	}
}
