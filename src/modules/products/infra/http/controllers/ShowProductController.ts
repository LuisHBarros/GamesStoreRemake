import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { ShowProductService } from '../../../services/ShowProductService';
import { container } from 'tsyringe';

export class ShowProductController {
	public async execute(req: Request, res: Response) {
		const { id } = req.params;
		const showProduct = container.resolve(ShowProductService);
		const product = await showProduct.execute({ id });
		return res.json(instanceToInstance(product));
	}
}
