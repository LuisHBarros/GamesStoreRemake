import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/AppError';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { add } from '../providers/implementations/BlackListRedisProvider';
import { IBlackListProvider } from '../providers/models/IBlackListProvider';

@injectable()
export class LogoutUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}
	public async execute(token: string, user_id: string) {
		const time = 60 * 60 * 2;
		try {
			await add(`${token}-${user_id}`, token, time);
			return 'the blacklist has been updated';
		} catch (e) {
			//@ts-ignore
			throw new AppError(e, 500);
		}
	}
}
