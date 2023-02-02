import { CreateUserService } from '../CreateUserService';
import { AppError } from '../../../../shared/errors/AppError';
import FakeHashProvider from '../../providers/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../../infra/fakes/FakeUsersRepository';
import { ForgotPasswordUserService } from '../ForgotPasswordUserService';
import { ResetUserPasswordService } from '../ResetUserPasswordService';
import { subHours } from 'date-fns';
import { FakeMailService } from '../../../../config/mail/fakemail/FakeMailService';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;
let forgotPasswordUser: ForgotPasswordUserService;
let resetUserPassword: ResetUserPasswordService;
let fakeMailSerive: FakeMailService;

describe('create an user', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		fakeMailSerive = new FakeMailService();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		forgotPasswordUser = new ForgotPasswordUserService(
			fakeUsersRepository,
			hashProvider,
			fakeMailSerive,
		);
		resetUserPassword = new ResetUserPasswordService(
			fakeUsersRepository,
			hashProvider,
		);
	});
	it('should be able to set a forgotPassword token', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		const resetToken = await forgotPasswordUser.execute({ email: user.email });
		const resetUser = await resetUserPassword.execute({
			//@ts-ignore
			resetToken: resetToken.passwordResetToken,
			password: 'John123456',
		});
		expect(resetUser.password).toBe('John123456');
	});
	it('should not be able to reset the password with an invalid token', () => {
		expect(
			resetUserPassword.execute({
				resetToken: 'invalidToken',
				password: 'John123456',
			}),
		).rejects.toEqual(new AppError('User not found', 404));
	});
	it('should not be able to reset the password with an invalid one', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		const resetToken = await forgotPasswordUser.execute({
			email: user.email,
		});
		expect(
			resetUserPassword.execute({
				//@ts-ignore
				resetToken: resetToken.passwordResetToken,
				password: '123',
			}),
		).rejects.toEqual(new AppError('Invalid password', 400));
	});
	it('should not be able to reset the password with an expired token', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		const resetToken = await forgotPasswordUser.execute({
			email: user.email,
		});
		const resetUser = await fakeUsersRepository.save({
			id: user.id,
			name: user.name,
			created_at: user.created_at,
			email: user.email,
			password: user.password,
			adm: user.adm,
			passwordResetExpires: subHours(new Date(), 3),
			passwordResetToken: resetToken.passwordResetToken,
		});
		expect(
			resetUserPassword.execute({
				//@ts-ignore
				resetToken: resetToken.passwordResetToken,
				password: 'John1234567',
			}),
		).rejects.toEqual(new AppError('ResetToken expired', 401));
	});
});
