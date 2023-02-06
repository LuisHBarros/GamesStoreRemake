import { ICreateProduct } from '../models/ICreateProduct';
import { IProduct } from '../models/IProduct';

export interface IProductRepository {
	save(dataProducts: IProduct): Promise<IProduct>;
	findById(id: string): Promise<IProduct | null>;
	create(dataProducts: ICreateProduct): Promise<IProduct>;
	findAll(): Promise<IProduct[]>;
	delete(id: string): Promise<void>;
	findByName(name: string): Promise<IProduct | null>;
}
