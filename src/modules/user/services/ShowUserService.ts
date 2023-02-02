import { AppError } from '../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowUser } from '../domain/models/IShowUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
export class ShowUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}
	public async execute(data: IShowUser) {
		const user = await this.usersRepository.findById(data.user_id);
		if (!user) throw new AppError(`User ${data.user_id} not found`);

		return user;
	}
}
