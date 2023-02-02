import { FakeUsersRepository } from '../../infra/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/fakes/FakeHashProvider';
import { CreateUserService } from '../CreateUserService';
import { AppError } from '../../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('create an user', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
	});
	it('should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		expect(user).toHaveProperty('id');
	});
	it('should not be able to create a new user with a email already registered', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
			adm: false,
		});
		expect(
			createUser.execute({
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'Abcd12345',
				adm: false,
			}),
		).rejects.toEqual(
			new AppError('There is already one account with this email', 400),
		);
	});
	it('should not be able to create a new user with a invalid password', () => {
		expect(() => {
			return createUser.execute({
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'invalid',
				adm: false,
			});
		}).rejects.toEqual(
			new AppError(
				'a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers',
				400,
			),
		);
	});
	it('should be able to create a new user with no adm', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
		});
		expect(user).toHaveProperty('id');
	});
});
