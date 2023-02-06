import 'reflect-metadata';
import '../../container';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import cors from 'cors';
import routes from './routes';
import { AppError } from '../../errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import uploadConfig from '../../../config/upload';
// import '../../../';

const app = express();
app.use(cors());
app.use((req, res, next) => {
	if (req.originalUrl === '/payment/webhook') {
		next(); // Do nothing with the body because I need it in a raw state.
	} else {
		express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
	}
});
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use('/files', express.static(uploadConfig.directory));
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof AppError)
		return res
			.status(error.statusCode)
			.json({ status: error, message: error.message });
});

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}👑`);
});

export { app };
