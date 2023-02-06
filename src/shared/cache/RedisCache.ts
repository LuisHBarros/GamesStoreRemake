import Redis, { Redis as RedisClient } from 'ioredis';
import redisConfig from '../../config/cache';
import { AppError } from '../errors/AppError';
import { ICache } from '../providers/models/ICache';

export class RedisCache implements ICache {
	private client: RedisClient;

	constructor() {
		this.client = new Redis(redisConfig.config.redis);
	}
	public async save(key: string, value: any): Promise<void> {
		await this.client.set(key, JSON.stringify(value));
	}
	public async recover<T>(key: string): Promise<T | null> {
		const data = await this.client.get(key);
		if (!data) return null;
		return JSON.parse(data) as T;
	}
	public async invalidate(key: string): Promise<boolean> {
		try {
			await this.client.del(key);
			console.log('cache apagado');
			return true;
		} catch (error) {
			throw new AppError('' + error);
		}
	}
}
