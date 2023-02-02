import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ICreateUserv2 } from '../../domain/models/ICreateUser';
import { IUser } from '../../domain/models/IUser';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';

export class FakeUsersRepository implements IUsersRepository {
	private users: User[] = [];
	public async create({
		name,
		email,
		password,
		adm,
	}: ICreateUserv2): Promise<User> {
		const user: User = {
			id: uuidv4(),
			name: name,
			email: email,
			password: password,
			adm: adm,
			passwordResetToken: null,
			passwordResetExpires: null,
			created_at: new Date(),
		};
		this.users.push(user);
		return user;
	}
	public async findByResetToken(reset_token: string): Promise<User | null> {
		const user = this.users.find(
			user => user.passwordResetToken === reset_token,
		);
		if (!user) return null;
		return user;
	}
	public async findById(user_id: string): Promise<User | null> {
		const user = this.users.find(user => user.id === user_id);
		if (!user) return null;
		return user;
	}
	public async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find(user => user.email === email);
		if (!user) return null;
		return user;
	}
	public async save(data: IUser): Promise<User> {
		const findIndex = this.users.findIndex(findUser => findUser.id === data.id);

		//@ts-ignore
		this.users[findIndex] = data;

		return this.users[findIndex];
	}
}
