import { AppError } from '../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ILoginUser } from '../domain/models/ILoginUser';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';
import { ITokenProvider } from '../providers/models/ITokenProvider';
// import { IHashProvider }

@injectable()
export class LoginUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
		@inject('TokenProvider')
		private tokenProvider: ITokenProvider,
	) {}
	public async execute({
		email,
		password,
	}: ILoginUser): Promise<IUserAuthenticated> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user)
			throw new AppError('No user registered with this email adress', 404);

		const passwordConfirmed = await this.hashProvider.compareHash(
			password,
			user.password,
		);

		if (!passwordConfirmed) {
			throw new AppError('Invalid password', 401);
		}
		const token = this.tokenProvider.createToken(user.id);
		return { user, token };
	}
}
