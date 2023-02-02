import { ITokenProvider, TokenPayload } from '../models/ITokenProvider';

export class FakeTokenProvider implements ITokenProvider {
	public createToken(subject: string): string {
		return subject;
	}
	public validateToken(token: string): string | TokenPayload {
		return token;
	}
}
