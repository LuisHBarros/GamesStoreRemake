import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { PrismaClient, User } from '@prisma/client';
import { IUser } from '../../domain/models/IUser';

export class UsersRepository implements IUsersRepository {
	private prisma = new PrismaClient();

	public async create({ name, email, password, adm }: IUser): Promise<User> {
		return await this.prisma.user.create({
			data: {
				name,
				email,
				password,
				adm,
			},
		});
	}

	public async findById(user_id: string): Promise<IUser | null> {
		return await this.prisma.user.findFirst({
			where: { id: user_id },
		});
	}

	public async findByEmail(email: string): Promise<IUser | null> {
		return await this.prisma.user.findUnique({
			where: { email: email },
		});
	}

	public async findByResetToken(reset_token: string): Promise<IUser | null> {
		return await this.prisma.user.findFirst({
			where: { passwordResetToken: reset_token },
		});
	}
	public async save(data: IUser): Promise<IUser> {
		return await this.prisma.user.update({
			where: { email: data.email },
			data: {
				name: data.name,
				password: data.password,
				passwordResetToken: data.passwordResetToken,
				passwordResetExpires: data.passwordResetExpires,
			},
		});
	}
}
