import { CreateUserService } from '../CreateUserService';
import { AppError } from '../../../../shared/errors/AppError';
import FakeHashProvider from '../../providers/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../../infra/fakes/FakeUsersRepository';
import { ForgotPasswordUserService } from '../ForgotPasswordUserService';
import { FakeMailService } from '../../../../config/mail/fakemail/FakeMailService';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;
let fakeMailSerive: FakeMailService;
let forgotPasswordUser: ForgotPasswordUserService;

describe('create an user', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		fakeMailSerive = new FakeMailService();
		forgotPasswordUser = new ForgotPasswordUserService(
			fakeUsersRepository,
			hashProvider,
			fakeMailSerive,
		);
	});
	it('should be able to set a forgotPassword token', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		const reset = await forgotPasswordUser.execute({ email: user.email });
		expect(reset).toHaveProperty('passwordResetToken');
		expect(reset).toHaveProperty('passwordResetExpires');
	});
	it('should not be able to set a forgotPassword token with an invalid id', async () => {
		expect(forgotPasswordUser.execute({ email: 'invalid' })).rejects.toEqual(
			new AppError('User not found', 404),
		);
	});
});
