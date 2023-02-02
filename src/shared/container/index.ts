import { container } from 'tsyringe';
import { UsersRepository } from '../../modules/user/infra/prisma/UsersRepository';
import BcryptHashProvider from '../../modules//user/providers/implementations/BcryptHashProvider';
import { JwbTokenProvider } from '../../modules/user/providers/implementations/JwbTokenProvider';
import ProductsRepository from '../../modules/products/infra/prisma/ProductsRepository';
import { IUsersRepository } from '../../modules/user/domain/repositories/IUsersRepository';
import { IProductRepository } from '../../modules/products/domain/repositories/IProductsRepository';
import { IHashProvider } from '../../modules/user/providers/models/IHashProvider';
import { ITokenProvider } from '../../modules/user/providers/models/ITokenProvider';
import { IDonePaymentsRepository } from '../../modules/payments/domain/models/IDonePaymentsRepository';
import DonePaymentsRepository from '../../modules/payments/infra/prisma/PaymentsRepository';
import { IMail } from '../../config/mail/Interfaces';
import Mailer from '../../config/mail/nodemailer';
import { RedisCache } from '../cache/RedisCache';
import { ICache } from '../providers/models/ICache';
import { IPaymentProvider } from '../../modules/payments/providers/models/IPaymentProvider';
import { StripeProvider } from '../../modules/payments/providers/implementations/StripeProvider';

container.registerSingleton<IUsersRepository>(
	'UsersRepository',
	UsersRepository,
);

container.registerSingleton<IProductRepository>(
	'ProductsRepository',
	ProductsRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);

container.registerSingleton<IDonePaymentsRepository>(
	'DonePaymentsRepository',
	DonePaymentsRepository,
);
container.registerSingleton<IMail>('MailService', Mailer);

container.registerSingleton<ICache>('CacheService', RedisCache);

container.registerSingleton<IPaymentProvider>(
	'PaymentProvider',
	StripeProvider,
);

container.registerSingleton<ITokenProvider>('TokenProvider', JwbTokenProvider);
