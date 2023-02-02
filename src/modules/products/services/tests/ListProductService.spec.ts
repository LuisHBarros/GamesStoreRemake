import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';
import { FakeProductRepository } from '../../domain/repositories/fakes/FakeProductsRepository';
import { CreateProductService } from '../CreateProductService';
import { ListProductsService } from '../ListProductsService';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let createProduct: CreateProductService;
let listProducts: ListProductsService;

describe('show an product list', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createProduct = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
		listProducts = new ListProductsService(
			fakeProductRepository,
			fakeCacheProvider,
		);
	});
	it('should be able to list products', async () => {
		await createProduct.execute({
			name: 'test product',
			price: 100,
			description: 'test product description',
			image: 'test product image',
			stock: 10,
		});
		const productsFound = await listProducts.execute();
		expect(productsFound[0]).toHaveProperty('id');
		expect(productsFound[0].name).toEqual('test product');
	});
});
