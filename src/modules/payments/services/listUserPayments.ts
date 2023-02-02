import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/AppError';
import { IUsersRepository } from '../../user/domain/repositories/IUsersRepository';
import { IDonePayments } from '../domain/models/IDonePayments';
import { IDonePaymentsRepository } from '../domain/models/IDonePaymentsRepository';

@injectable()
export class ListUserPaymentsService {
	constructor(
		@inject('DonePaymentsRepository')
		private DonePaymentsRepository: IDonePaymentsRepository,
		@inject('UsersRepository')
		private userRepository: IUsersRepository,
	) {}
	public async execute(user_id: string): Promise<IDonePayments[] | null> {
		const user = await this.userRepository.findById(user_id);
		if (!user) throw new AppError('No user with id ' + user_id, 404);
		return await this.DonePaymentsRepository.findByCustomerEmail(user.email);
	}
}
