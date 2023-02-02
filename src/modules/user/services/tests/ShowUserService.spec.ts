import { FakeUsersRepository } from '../../infra/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/fakes/FakeHashProvider';
import { CreateUserService } from '../CreateUserService';
import { ShowUserService } from '../ShowUserService';
import { AppError } from '../../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;
let showUser: ShowUserService;

describe('show an user', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		showUser = new ShowUserService(fakeUsersRepository);
	});
	it('should show a user', async () => {
		const userRegistered = await createUser.execute({
			name: 'John Doe',
			email: 'John@Doe.com',
			password: 'JohnD123456',
		});
		const user = await showUser.execute({ user_id: userRegistered.id });
		expect(user.name).toBe('John Doe');
	});
	it('shoud not show a unregistered user', async () => {
		expect(showUser.execute({ user_id: 'not a id' })).rejects.toEqual(
			new AppError(`User ${'not a id'} not found`),
		);
	});
});
