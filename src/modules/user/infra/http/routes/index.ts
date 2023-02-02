import { isAuthenticated } from '../../../../../shared/infra/http/middlewares/isAuthenticated';
import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserController } from '../controller/CreateUserController';
import { ForgotPasswordUserController } from '../controller/ForgotPasswordUserController';
import { LoginUserController } from '../controller/LoginUserController';
import { ResetUserPasswordController } from '../controller/ResetUserPasswordController';
import { ShowUserController } from '../controller/ShowUserController';
import { celebrate, Joi, Segments } from 'celebrate';
import { LogoutUserController } from '../controller/LogoutUserController';

const usersRouter = Router();
const createUser = new CreateUserController();
const loginUser = new LoginUserController();
const showUser = new ShowUserController();
const logoutUser = new LogoutUserController();
const ForgotPassword = new ForgotPasswordUserController();
const ResetPassword = new ResetUserPasswordController();
const isAuth = new isAuthenticated();

usersRouter
	.get('/', isAuth.execute, () => showUser.execute)
	.post(
		'/register',
		celebrate({
			[Segments.BODY]: {
				name: Joi.string().required(),
				email: Joi.string().email().required(),
				password: Joi.string().required(),
				adm: Joi.boolean(),
			},
		}),
		createUser.execute,
	)
	.post(
		'/login',
		celebrate({
			[Segments.BODY]: {
				email: Joi.string().email().required(),
				password: Joi.string().required(),
			},
		}),
		loginUser.execute,
	)
	.post(
		'/forgot-password',
		celebrate({
			[Segments.BODY]: {
				email: Joi.string().email().required(),
			},
		}),
		ForgotPassword.execute,
	)
	.post(
		'/recover-password',
		celebrate({
			[Segments.BODY]: {
				resetToken: Joi.number().required(),
				password: Joi.string().required(),
			},
		}),
		ResetPassword.execute,
	)
	.get('/logout', isAuth.execute, logoutUser.execute);

export default usersRouter;
