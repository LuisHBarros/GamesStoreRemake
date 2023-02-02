import 'reflect-metadata';
import { AppError } from '../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateUser } from '../domain/models/ICreateUser';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';

@injectable()
export class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	public async execute({
		name,
		email,
		password,
		adm,
	}: ICreateUser): Promise<IUser> {
		const userExists = await this.usersRepository.findByEmail(email);

		if (userExists) {
			throw new AppError('There is already one account with this email', 400);
		}
		if (!this.regex.test(password)) {
			throw new AppError(
				'a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers',
				400,
			);
		}

		const hashPassword = await this.hashProvider.generateHash(password);

		return this.usersRepository.create({
			name,
			email,
			password: hashPassword,
			adm,
		});
	}
}
