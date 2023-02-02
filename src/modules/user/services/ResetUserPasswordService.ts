import { AppError } from '../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUser } from '../domain/models/IUser';
import { addHours, isAfter } from 'date-fns';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';
import { IResetPassword } from '../domain/models/IResetPassword';

@injectable()
export class ResetUserPasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

	public async execute(data: IResetPassword): Promise<IUser> {
		const user = await this.usersRepository.findByResetToken(data.resetToken);
		if (!user) throw new AppError('User not found', 404);

		if (!this.regex.test(data.password))
			throw new AppError('Invalid password', 400);
		//@ts-ignore
		const expireDateTime = addHours(user.passwordResetExpires, 2);
		if (isAfter(Date.now(), expireDateTime))
			throw new AppError('ResetToken expired', 401);
		const hash = await this.hashProvider.generateHash(data.password);
		user.password = hash;
		user.passwordResetExpires = null;
		user.passwordResetToken = null;

		return await this.usersRepository.save(user);
	}
}
