import 'reflect-metadata';
import { app } from '../../../../../../shared/infra/http/server';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('Create User Controller', () => {
	it('should be able to connect and create a user', async () => {
		const response = await request(app).post('/user/register').send({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'John123456',
		});
		console.log(response.status);
	});
});
