export interface TokenPayload {
	[key: string]: any;
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp?: number | undefined;
	nbf?: number | undefined;
	iat?: number | undefined;
	jti?: string | undefined;
}

export interface ITokenProvider {
	createToken(subject: string): string;
	validateToken(token: string): string | TokenPayload;
}
