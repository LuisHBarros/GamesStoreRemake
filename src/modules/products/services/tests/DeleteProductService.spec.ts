import { AppError } from '../../../../shared/errors/AppError';
import { CreateProductService } from '../CreateProductService';
import { ShowProductService } from '../ShowProductService';
import { DeleteProductService } from '../DeleteProduct';
import { FakeProductRepository } from '../../domain/repositories/fakes/FakeProductsRepository';
import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';

let fakeProductRepository: FakeProductRepository;
let createProduct: CreateProductService;
let fakeCacheProvider: FakeCacheProvider;
let deleteProduct: DeleteProductService;
let showProductService: ShowProductService;

describe('delete an product', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createProduct = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
		deleteProduct = new DeleteProductService(
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
		await deleteProduct.execute({ id: product.id });
		expect(showProductService.execute({ id: product.id })).rejects.toEqual(
			new AppError('This product does not exist', 404),
		);
	});
	it('should not be able to delete a non existing product', async () => {
		expect(deleteProduct.execute({ id: 'invalid one' })).rejects.toEqual(
			new AppError('This product does not exist', 404),
		);
	});
});
