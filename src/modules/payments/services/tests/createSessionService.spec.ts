import { AppError } from '../../../../shared/errors/AppError';
import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';
import { FakeProductRepository } from '../../../products/domain/repositories/fakes/FakeProductsRepository';
import { CreateProductService } from '../../../products/services/CreateProductService';
import { FakeUsersRepository } from '../../../user/infra/fakes/FakeUsersRepository';
import FakeHashProvider from '../../../user/providers/fakes/FakeHashProvider';
import { CreateUserService } from '../../../user/services/CreateUserService';
import { FakeDonePaymentsRepository } from '../../infra/fakes/FakePaymentRepository';
import { FakePaymentProvider } from '../../providers/fakes/FakePaymentProvider';
import { CreateSessionService } from '../createSessionService';

let fakeProductRepository: FakeProductRepository;
let fakeDonePaymentsRepository: FakeDonePaymentsRepository;
let createProductService: CreateProductService;
let createSessionService: CreateSessionService;
let fakeUsersRepository: FakeUsersRepository;
let fakePaymentProvider: FakePaymentProvider;
let createUserService: CreateUserService;
let hashProvider: FakeHashProvider;
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
	});
	it('should create a payment session', async () => {
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
		expect(session).toHaveProperty('id');
	});
	it('should not be able to create a session with a unregistered product', async () => {
		expect(
			createSessionService.execute(
				{
					products: [
						{
							id: 'any',
							quantity: 10,
						},
					],
				},
				'any_id',
			),
		).rejects.toEqual(new AppError('product not found', 404));
	});
	it('should not be able to create a session without a user', async () => {
		const product = await createProductService.execute({
			name: 'Test Product',
			description: 'a test product',
			price: 100,
			stock: 10,
			image: 'any',
		});
		expect(
			createSessionService.execute(
				{
					products: [
						{
							id: product.id,
							quantity: 10,
						},
					],
				},
				'some false id',
			),
		).rejects.toEqual(new AppError('User not found', 404));
	});
	it('should not be able to create a session with more product quantity than the stock', async () => {
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
		expect(
			createSessionService.execute(
				{
					products: [
						{
							id: product.id,
							quantity: 11,
						},
					],
				},
				user.id,
			),
		).rejects.toEqual(
			new AppError('we not have enough stock for this quantity', 500),
		);
	});
});
