import { AppError } from '../../../../shared/errors/AppError';
import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';
import { FakeProductRepository } from '../../../products/domain/repositories/fakes/FakeProductsRepository';
import { CreateProductService } from '../../../products/services/CreateProductService';
import { FakeUsersRepository } from '../../../user/infra/fakes/FakeUsersRepository';
import { UsersRepository } from '../../../user/infra/prisma/UsersRepository';
import FakeHashProvider from '../../../user/providers/fakes/FakeHashProvider';
import { CreateUserService } from '../../../user/services/CreateUserService';
import { FakeDonePaymentsRepository } from '../../infra/fakes/FakePaymentRepository';
import DonePaymentsRepository from '../../infra/prisma/PaymentsRepository';
import { FakePaymentProvider } from '../../providers/fakes/FakePaymentProvider';
import { CreateSessionService } from '../createSessionService';
import { ListUserPaymentsService } from '../listUserPayments';

let fakeProductRepository: FakeProductRepository;
let fakeDonePaymentsRepository: FakeDonePaymentsRepository;
let createProductService: CreateProductService;
let createSessionService: CreateSessionService;
let fakeUsersRepository: FakeUsersRepository;
let fakePaymentProvider: FakePaymentProvider;
let createUserService: CreateUserService;
let hashProvider: FakeHashProvider;
let listUserPaymentsService: ListUserPaymentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('create a payment session', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeDonePaymentsRepository = new FakeDonePaymentsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository();
		fakePaymentProvider = new FakePaymentProvider();
		hashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			hashProvider,
		);
		createProductService = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
		createSessionService = new CreateSessionService(
			fakeProductRepository,
			fakeDonePaymentsRepository,
			fakeUsersRepository,
			fakePaymentProvider,
		);
		listUserPaymentsService = new ListUserPaymentsService(
			fakeDonePaymentsRepository,
			fakeUsersRepository,
		);
	});
	it('should be able to list a user payments', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd123456',
		});
		const product = await createProductService.execute({
			name: 'Test Product',
			description: 'a test product',
			price: 100,
			stock: 10,
			image: 'any',
		});
		const session = await createSessionService.execute(
			{
				products: [
					{
						id: product.id,
						quantity: 10,
					},
				],
			},
			user.id,
		);
		const payments = await listUserPaymentsService.execute(user.id);
		if (!payments) throw new Error('Error on service');
		expect(payments[0].customer_email).toBe(user.email);
	});
	it('should not be able to list the payments of an unregistered user', async () => {
		expect(listUserPaymentsService.execute('not an id')).rejects.toEqual(
			new AppError('No user with id ' + 'not an id', 404),
		);
	});
});
