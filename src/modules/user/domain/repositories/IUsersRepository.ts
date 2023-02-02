import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUser';

export interface IUsersRepository {
	create({ name, email, password, adm }: ICreateUser): Promise<IUser>;
	findById(user_id: string): Promise<IUser | null>;
	findByEmail(email: string): Promise<IUser | null>;
	findByResetToken(reset_token: string): Promise<IUser | null>;
	save(data: IUser): Promise<IUser>;
}
