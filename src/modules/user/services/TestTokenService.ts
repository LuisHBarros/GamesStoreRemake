import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/AppError';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { ITokenProvider } from '../providers/models/ITokenProvider';

@injectable()
export class TestTokenService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async execute(user_id: string) {
		const user = this.usersRepository.findById(user_id);
		if (!user) throw new AppError(`User ${user_id} not found`, 404);
		return user;
	}
}
