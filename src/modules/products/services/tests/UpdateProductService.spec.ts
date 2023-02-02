import { CreateProductService } from '../CreateProductService';
import { UpdateProductService } from '../UpdateProductService';
import { AppError } from '../../../../shared/errors/AppError';
import { FakeProductRepository } from '../../domain/repositories/fakes/FakeProductsRepository';
import { FakeCacheProvider } from '../../../../shared/providers/fakes/FakeCacheProvider';

let fakeProductRepository: FakeProductRepository;
let createProduct: CreateProductService;
let updateProduct: UpdateProductService;
let fakeCacheProvider: FakeCacheProvider;

describe('update an product', () => {
	beforeEach(() => {
		fakeProductRepository = new FakeProductRepository();
		fakeCacheProvider = new FakeCacheProvider();
		createProduct = new CreateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
		updateProduct = new UpdateProductService(
			fakeProductRepository,
			fakeCacheProvider,
		);
	});
	it('should be able to update an exiting product', async () => {
		const product = await createProduct.execute({
			name: 'test product',
			price: 100,
			description: 'test product description',
			image: 'test product image',
			stock: 10,
		});
		const updatedProduct = await updateProduct.execute({
			id: product.id,
			name: 'updated product',
			price: 100,
			description: 'test product description',
			image: 'test product image',
			stock: 10,
		});
		//@ts-ignore
		expect(updatedProduct.name).toEqual('updated product');
	});
	it('should not be able to update a non-existent product', async () => {
		expect(
			updateProduct.execute({
				id: 'none',
				name: 'test product',
				price: 100,
				description: 'test product description',
				image: 'test product image',
				stock: 10,
			}),
		).rejects.toEqual(new AppError('This product does not exist', 404));
	});
});
