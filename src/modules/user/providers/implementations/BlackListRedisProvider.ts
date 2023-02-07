import Redis, { Redis as RedisClient } from 'ioredis';
import RedisConfig from '../../../../config/cache';
import { AppError } from '../../../../shared/errors/AppError';

export async function add(key: string, value: string, expires: number) {
	try {
		const client = new Redis(RedisConfig.config.redis);
		await client.set(key, value, 'EX', expires);
	} catch (e) {
		//@ts-ignore
		throw new AppError(`${e}`);
	}
}

export async function search(key: string): Promise<string | null> {
	try {
		const client = new Redis(RedisConfig.config.redis);
		return await client.get(key);
	} catch (e) {
		throw new AppError(`${e}`);
	}
}
