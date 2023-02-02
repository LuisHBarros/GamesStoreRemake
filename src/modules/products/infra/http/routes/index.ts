import { isAuthenticated } from '../../../../../shared/infra/http/middlewares/isAuthenticated';
import { Request, Router, NextFunction, Response } from 'express';
import { container } from 'tsyringe';
import { CreateProductController } from '../controllers/CreateProductController';
import { UpdateProductController } from '../controllers/UpdateProductController';
import { ShowProductController } from '../controllers/ShowProductController';
import { ListProductController } from '../controllers/ListProductController';
import { DeleteProductController } from '../controllers/DeleteProductController';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAdministrator } from '../../../../../shared/infra/http/middlewares/isAdministrator';

const productRouter = Router();
const createProduct = new CreateProductController();
const UpdateProduct = new UpdateProductController();
const ShowProduct = new ShowProductController();
const ListProduct = new ListProductController();
const DeleteProduct = new DeleteProductController();
const isAuth = new isAuthenticated();
const isAdm = new isAdministrator();

productRouter
	.get('/', ListProduct.execute)
	.get(
		'/:id',
		celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
		ShowProduct.execute,
	)
	.post(
		'/',
		celebrate({
			[Segments.BODY]: {
				name: Joi.string().uuid().required(),
				description: Joi.string().uuid().required(),
				price: Joi.number().required(),
				stock: Joi.number().required(),
				image: Joi.any().required(),
			},
		}),
		isAuth.execute,
		isAdm.execute,
		createProduct.execute,
	)
	.put(
		'/:id',
		celebrate({
			[Segments.PARAMS]: { id: Joi.string().uuid().required() },
			[Segments.BODY]: {
				name: Joi.string(),
				description: Joi.string(),
				price: Joi.number(),
				stock: Joi.number(),
				image: Joi.any(),
			},
		}),
		isAuth.execute,
		isAdm.execute,
		UpdateProduct.execute,
	)
	.delete(
		'/:id',
		celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
		isAuth.execute,
		isAdm.execute,
		DeleteProduct.execute,
	);

export default productRouter;
