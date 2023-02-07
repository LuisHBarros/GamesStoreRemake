import { Product } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IProduct } from '../../models/IProduct';
import { IProductRepository } from '../IProductsRepository';

export class FakeProductRepository implements IProductRepository {
	async findByName(name: string): Promise<IProduct | null> {
		const product = this.product.find(product => product.name === name);
		if (!product) return null;
		return product;
	}
	async findAll(): Promise<IProduct[]> {
		return this.product;
	}
	private product: Product[] = [];
	public async save(dataProducts: IProduct): Promise<IProduct> {
		const findIndex = this.product.findIndex(
			product => product.id === dataProducts.id,
		);
		this.product[findIndex] = {
			description: dataProducts.description,
			name: dataProducts.name,
      price: dataProducts.price,
      stock: dataProducts.stock,
			image: dataProducts.image,
			id: dataProducts.id,
    };
		return this.product[findIndex];
	}
	public async findById(id: string): Promise<IProduct | null> {
		const product = this.product.find(product => product.id === id);
		if (!product) return null;
		return product;
	}
	public async create(dataProducts: IProduct): Promise<IProduct> {
		const product: Product = {
			id: uuidv4(),
			name: dataProducts.name,
			price: dataProducts.price,
			image: dataProducts.image,
			description: dataProducts.description,
			stock: dataProducts.stock,
		};
		this.product.push(product);
		return product;
	}
	public async delete(id: string): Promise<void> {
		const findIndex = this.product.findIndex(product => product.id === id);
		this.product.splice(findIndex, 1);
	}
}
