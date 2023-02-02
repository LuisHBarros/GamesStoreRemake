export interface IUser {
	id: string;
	name: string;
	email: string;
	password: string;
	adm?: boolean;
	passwordResetToken: string | null;
	passwordResetExpires: Date | null;
	created_at: Date;
}
