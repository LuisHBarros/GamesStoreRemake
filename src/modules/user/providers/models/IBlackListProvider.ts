export interface IBlackListProvider {
	add(key: string, value: string, expires: number): Promise<void>;
	search(value: string): Promise<void>;
}
