import { Router } from 'express';
import productRouter from '../../../../modules/products/infra/http/routes';
import paymentRouter from '../../../../modules/payments/infra/http/routes';
import usersRouter from '../../../../modules/user/infra/http/routes';

const routes = Router();
routes.get('/', (req, res) => {
	return res.json({ message: 'Hello Dev!' });
});
routes.use('/user', usersRouter);
routes.use('/product', productRouter);
routes.use('/payment', paymentRouter);

export default routes;
