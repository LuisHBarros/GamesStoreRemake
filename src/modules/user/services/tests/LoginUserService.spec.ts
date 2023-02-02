import { FakeUsersRepository } from '../../infra/fakes/FakeUsersRepository';
import { FakeTokenProvider } from '../../providers/fakes/FakeTokenProvider';
import FakeHashProvider from '../../providers/fakes/FakeHashProvider';
import { CreateUserService } from '../CreateUserService';
import { LoginUserService } from '../LoginUserService';
import { AppError } from '../../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;
let loginUser: LoginUserService;
let fakeTokenProvider: FakeTokenProvider;

describe('create an user', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		fakeTokenProvider = new FakeTokenProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		loginUser = new LoginUserService(
			fakeUsersRepository,
			hashProvider,
			fakeTokenProvider,
		);
	});
	it('should be able to login with a valid user', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
		});
		const user = await loginUser.execute({
			email: 'john@doe.com',
			password: 'Abcd12345',
		});
		expect(user).toHaveProperty('token');
	});
	it('should not be able to login with a invalid password', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
		});

		expect(
			loginUser.execute({
				email: 'john@doe.com',
				password: 'invalid',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to login with a unregistered email', async () => {
		expect(
			loginUser.execute({
				email: 'john@doe.com',
				password: 'any',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
