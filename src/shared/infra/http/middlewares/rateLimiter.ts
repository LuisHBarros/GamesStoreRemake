import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { AppError } from '../../../errors/AppError';
import redisConfig from '../../../../config/redisConfig';

export default async function rateLimiter(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const redisClient = new Redis({
			host: redisConfig.redis.host,
			port: Number(redisConfig.redis.port),
			password: redisConfig.redis.password,
		});
		const limiter = new RateLimiterRedis({
			storeClient: redisClient,
			keyPrefix: 'rate-limiter',
			points: 10,
			duration: 1,
		});
		await limiter.consume(req.ip);
		return next();
	} catch (e) {
		throw new AppError('Too many requests', 500);
	}
}
