import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UpdateProductService } from '../../../services/UpdateProductService';
import { container } from 'tsyringe';

export class UpdateProductController {
	public async execute(req: Request, res: Response) {
		const updateProduct = container.resolve(UpdateProductService);
		const product = await updateProduct.execute(req.body);
		return res.json(instanceToInstance(product));
	}
}
