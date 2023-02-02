import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { DeleteProductService } from '../../../services/DeleteProduct';
import { container } from 'tsyringe';

export class DeleteProductController {
	public async execute(req: Request, res: Response) {
		const { id } = req.params;
		const showProduct = container.resolve(DeleteProductService);
		const product = await showProduct.execute({ id });
		return res.json(instanceToInstance(product));
	}
}
