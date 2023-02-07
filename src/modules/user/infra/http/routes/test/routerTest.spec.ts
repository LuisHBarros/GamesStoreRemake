import 'reflect-metadata';
import { app } from '../../../../../../shared/infra/http/server';
import request from 'supertest';
import fs from 'mz/fs';

describe('testing user routes', () => {
	var id: string;
	var token: string;
	test('should create a user', async () => {
		const response = await request(app).post('/user/register').send({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'Abcd123456',
		});
		id = response.body.id;

		expect(response.body).toHaveProperty('id');
	});
	test('should be able to login with a registered account', async () => {
		const response = await request(app).post(`/user/login`).send({
			email: 'john@example.com',
			password: 'Abcd123456',
		});
		token = response.body.token;
		expect(response.body).toHaveProperty('token');
	});
	test('should be able to show the profile compatible with the given token', async () => {
		const response = await request(app)
			.get(`/user/`)
			.set('Authorization', `Bearer ${token}`);
		expect(response.body).toHaveProperty('id');
	});
	test('it should be possible to logout', async () => {
		const response = await request(app)
			.get('/user/logout')
			.set('Authorization', `Bearer ${token}`);
		expect(response.statusCode).toBe(200);
		const response2 = await request(app)
			.get(`/user/`)
			.set('Authorization', `Bearer ${token}`);
		expect(response2.status).toBe(401);
	});
});

describe('testing products routes', () => {
	var id: string;
	var token: string;
	test('should create a product', async () => {
		let testFilePath = null;
		const filePath = `${__dirname}/testfiles/lorian.jpg`;
		await request(app).post('/user/register').send({
			name: 'John Doe',
			email: 'john2@example.com',
			password: 'Abcd123456',
			adm: true,
		});
		const user = await request(app).post('/user/login').send({
			email: 'john2@example.com',
			password: 'Abcd123456',
		});
		expect(user.body).toHaveProperty('token');
		token = user.body.token;
		fs.exists(filePath).then(exists => {
			if (!exists) throw new Error('file does not exist');
		});
		const response = await request(app)
			.post('/product')
			.field({
				name: 'Lorian',
				price: 1000,
				stock: 10,
				description: 'Lorian description',
			})
			.attach('image', filePath)
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toBe(200);
		id = response.body.id;
	});
	test('should be able to show the product', async () => {
		const response = await request(app).get(`/product/${id}`);
		expect(response.body.name).toEqual('Lorian');
	});
	test('should find a product in the list', async () => {
		const response = await request(app).get('/product');
		expect(response.body[0].name).toEqual('Lorian');
	});
	test('should update a product', async () => {
		let testFilePath = null;
		const filePath = `${__dirname}/testfiles/pontiff sulyvahn.jpg`;
		fs.exists(filePath).then(exists => {
			if (!exists) throw new Error('file does not exist');
		});
		const response = await request(app)
			.put(`/product/${id}`)
			.send({
				name: 'Pontiff Sulyvahn',
				price: 500,
				stock: 10,
				description: 'Pontiff Sulyvahn description',
			})
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toBe(200);
		expect(response.body.name).toEqual('Pontiff Sulyvahn');
	});
	test('should delete a product', async () => {
		const response = await request(app)
			.delete(`/product/${id}`)
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toBe(200);
		const product = await request(app)
			.get(`/product/${id}`)
			.set('Authorization', `Bearer ${token}`);
		expect(product.status).toBe(404);
	});
});

describe('testing payment routes', () => {
	jest.setTimeout(80000);
	test('should be able to create a session', async () => {
		const user = await request(app).post('/user/login').send({
			email: 'john2@example.com',
			password: 'Abcd123456',
		});
		const token = user.body.token;
		let testFilePath = null;
		const filePath = `${__dirname}/testfiles/pontiff sulyvahn.jpg`;
		fs.exists(filePath).then(exists => {
			if (!exists) throw new Error('file does not exist');
		});

		const product = await request(app)
			.post('/product')
			.field({
				name: 'Lorian',
				price: 1000,
				stock: 10,
				image: '',
				description: 'Lorian description',
			})
			.attach('image', filePath)
			.set('Authorization', `Bearer ${token}`);
		expect(product.status).toBe(200);
		const id = product.body.id;

			const response = await request(app)
				.post('/payment/sessions')
				.set('Authorization', `Bearer ${token}`)
				.send({
					products: [
						{
							id: id,
							quantity: 1,
						},
					],
				});
			expect(response.status).toBe(200);

	});
});
