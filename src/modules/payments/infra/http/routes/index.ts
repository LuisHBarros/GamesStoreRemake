import { celebrate, Joi, Segments } from 'celebrate';
import express, { Router } from 'express';
import { container } from 'tsyringe';
import { isAuthenticated } from '../../../../../shared/infra/http/middlewares/isAuthenticated';

import { CreateCheckoutController } from '../controller';

const PaymentController = new CreateCheckoutController();

const isAuth = container.resolve(isAuthenticated);

const paymentRouter = Router();

paymentRouter
	.get('/', isAuth.execute, PaymentController.listUserPayments)

	.post(
		'/sessions',
		celebrate({
			[Segments.BODY]: {
				products: Joi.array().items(
					Joi.object({
						id: Joi.string().uuid().required(),
						quantity: Joi.number().required(),
					}).required(),
				),
			},
		}),
		isAuth.execute,
		PaymentController.createSessions,
	)
	.post('/webhook', express.raw({ type: '*/*' }), PaymentController.webHook);

export default paymentRouter;

// "card_Number": "4242424242424242",
// "card_ExpMonth": 12,
// "card_ExpYear": 2023,
// "card_CVC" : 123,
// "card_Name": "Luis Henrique",
// "customer_id": "cus_NF5Dm5rGqiUV0I"
