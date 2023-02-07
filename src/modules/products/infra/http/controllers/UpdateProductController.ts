import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UpdateProductService } from '../../../services/UpdateProductService';
import { container } from 'tsyringe';

export class UpdateProductController {
	public async execute(req: Request, res: Response) {
		const updateProduct = container.resolve(UpdateProductService);
		const product = await updateProduct.execute({
			id: req.params.id,
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			image: req.file?.filename || '',
			stock: req.body.stock,
		});
		return res.json(instanceToInstance(product));
	}
}
