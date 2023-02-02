import { RedisOptions } from 'ioredis';
import redisConfig from './redisConfig';

interface CacheConfig {
	config: {
		redis: RedisOptions;
	};
	driver: string;
}
export default {
	config: redisConfig,
	driver: 'redis',
} as CacheConfig;
