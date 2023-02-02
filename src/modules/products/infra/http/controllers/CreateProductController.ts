import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateProductService } from '../../../services/CreateProductService';
import { container } from 'tsyringe';

export class CreateProductController {
	public async execute(req: Request, res: Response) {
		const createProduct = container.resolve(CreateProductService);
		const product = await createProduct.execute(req.body);
		return res.json(instanceToInstance(product));
	}
}
