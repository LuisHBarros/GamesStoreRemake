import { isThisMonth } from 'date-fns';
import { ICache } from '../models/ICache';

export class FakeCacheProvider implements ICache {
	private dict = new Map();
	async save(key: string, value: any): Promise<void> {
		this.dict.set(key, value);
	}
	async recover<T>(key: string): Promise<T | null> {
		return this.dict.get(key);
	}
	async invalidate(key: string): Promise<void> {
		this.dict = new Map();
	}
}
