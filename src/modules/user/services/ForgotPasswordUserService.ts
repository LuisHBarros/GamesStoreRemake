import { AppError } from '../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUser } from '../domain/models/IUser';
import { IForgotPassword } from '../domain/models/IForgotPassword';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';
import { IMail } from '../../../config/mail/Interfaces';
import path from 'path';

@injectable()
export class ForgotPasswordUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
		@inject('MailService')
		private userMail: IMail,
	) {}
	public async execute(data: IForgotPassword): Promise<IUser> {
		const user = await this.usersRepository.findByEmail(data.email);
		if (!user) {
			throw new AppError('User not found', 404);
		}
		const resetToken = String(Math.floor(Math.random() * 100000000));
		user.passwordResetToken = resetToken;
		user.passwordResetExpires = new Date();
		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'../views/forgot_password.hbs',
		);
		await this.userMail.sendEmail({
			to: {
				name: user.name,
				email: data.email,
			},
			subject: 'Recuperação de senha',
			template_data: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name,
					token: resetToken,
					link: `${process.env.WEB_URL}/reset_password?token=${resetToken}`,
				},
			},
			from: {
				name: 'Equipe API Vendas',
				email: 'equipe@apivendas.com.br',
			},
		});
		//need to implement an email sending method

		return await this.usersRepository.save(user);
	}
}
