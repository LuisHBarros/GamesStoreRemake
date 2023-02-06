import { isAuthenticated } from '../../../../../shared/infra/http/middlewares/isAuthenticated';
import { Request, Router, NextFunction, Response, request } from 'express';
import { CreateProductController } from '../controllers/CreateProductController';
import { UpdateProductController } from '../controllers/UpdateProductController';
import { ShowProductController } from '../controllers/ShowProductController';
import { ListProductController } from '../controllers/ListProductController';
import { DeleteProductController } from '../controllers/DeleteProductController';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAdministrator } from '../../../../../shared/infra/http/middlewares/isAdministrator';
import uploadConfig from '../../../../../config/upload';
import multer from 'multer';

const productRouter = Router();
const createProduct = new CreateProductController();
const UpdateProduct = new UpdateProductController();
const ShowProduct = new ShowProductController();
const ListProduct = new ListProductController();
const DeleteProduct = new DeleteProductController();
const isAuth = new isAuthenticated();
const isAdm = new isAdministrator();
const upload = multer(uploadConfig);

productRouter
	.get('/', ListProduct.execute)
	.get(
		'/:id',
		celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
		ShowProduct.execute,
	)
	.post(
		'/',
		isAuth.execute,
		isAdm.execute,
		upload.single('image'),
		createProduct.execute,
	)
	.put('/:id', isAuth.execute, isAdm.execute, checkImage, UpdateProduct.execute)
	.delete(
		'/:id',
		celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
		isAuth.execute,
		isAdm.execute,
		DeleteProduct.execute,
	);

export default productRouter;

function checkImage(req: Request) {
	if (req.file) {
		upload.single('image');
	}
}
