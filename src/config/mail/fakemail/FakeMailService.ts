import { IMail, ISendMail } from '../Interfaces';

export class FakeMailService implements IMail {
	async sendEmail({
		to,
		subject,
		template_data,
		from,
	}: ISendMail): Promise<void> {}
}
