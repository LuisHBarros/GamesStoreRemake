import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';
import { FakeProductRepository } from '../../domain/repositories/fakes/FakeProductsRepository';
import { CreateProductService } from '../CreateProductService';

let fakeProductRepository: FakeProductRepository;
let createProduct: CreateProductService;
let fakeCacheProvider: FakeCacheProvider;

describe('create an product', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createProduct = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
	});
	it('should be able to create a new product', async () => {
		const product = await createProduct.execute({
			name: 'test product',
			price: 100,
			description: 'test product description',
			image: 'test product image',
			stock: 12,
		});
		expect(product).toHaveProperty('id');
		expect(product.name).toEqual('test product');
	});
});
