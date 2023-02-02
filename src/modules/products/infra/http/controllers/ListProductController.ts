import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { ListProductsService } from '../../../services/ListProductsService';
import { container } from 'tsyringe';

export class ListProductController {
	public async execute(req: Request, res: Response) {
		const listProduct = container.resolve(ListProductsService);
		const products = await listProduct.execute();
		return res.json(instanceToInstance(products));
	}
}
