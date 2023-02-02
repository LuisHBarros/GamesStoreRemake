import { AppError } from '../../../../shared/errors/AppError';
import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';
import { FakeProductRepository } from '../../domain/repositories/fakes/FakeProductsRepository';
import { CreateProductService } from '../CreateProductService';
import { ShowProductService } from '../ShowProductService';

let fakeProductRepository: FakeProductRepository;
let createProduct: CreateProductService;
let showProductService: ShowProductService;
let fakeCacheProvider: FakeCacheProvider;

describe('delete an product', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createProduct = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
		showProductService = new ShowProductService(fakeProductRepository);
	});
	it('should be able to delete an existing product', async () => {
		const product = await createProduct.execute({
			name: 'test product',
			price: 100,
			description: 'test product description',
			image: 'test product image',
			stock: 10,
		});
		const foundProduct = await showProductService.execute({ id: product.id });
		//@ts-ignore
		expect(foundProduct.name).toEqual('test product');
	});
	it('should not be able to show a unexisting product', async () => {
		expect(showProductService.execute({ id: 'not an id' })).rejects.toEqual(
			new AppError('This product does not exist', 404),
		);
	});
});
