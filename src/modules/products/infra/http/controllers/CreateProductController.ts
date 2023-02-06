import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateProductService } from '../../../services/CreateProductService';
import { container } from 'tsyringe';
import ProductsRepository from '../../prisma/ProductsRepository';

export class CreateProductController {
	public async execute(req: Request, res: Response) {
		const createProduct = container.resolve(CreateProductService);
		const product = await createProduct.execute({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			//@ts-ignore
			image: req.file.filename,
			stock: req.body.stock,
		});
		return res.json(instanceToInstance(product));
	}
}
