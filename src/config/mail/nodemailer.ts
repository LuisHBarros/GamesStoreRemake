import nodemailer from 'nodemailer';
import { AppError } from '../../shared/errors/AppError';
import { HandlebarsMailTemplate } from './HandlebarsMailTemplate';
import { IMail, ISendMail } from './Interfaces';

export default class Mailer implements IMail {
	async sendEmail({
		to,
		subject,
		template_data,
		from,
	}: ISendMail): Promise<void> {
		const mailTemplate = new HandlebarsMailTemplate();
		const transport = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.SUPPORT_EMAIL_ADRESS,
				pass: process.env.SUPPORT_EMAIL_PASSWORD,
			},
		});
		await transport
			.sendMail({
				from: {
					name: from?.name || 'Equipe ApiStore',
					address: 'equipeAPI@suporte.com',
				},
				to: {
					name: to.name,
					address: to.email,
				},
				subject,
				html: await mailTemplate.parse(template_data),
			})
			.catch(err => {
				throw new AppError(`Error on sending email, ${err}`);
			});
	}
}
