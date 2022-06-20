import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

export function generate(input: createToken, expiresIn: string, secret: string): string {
	const token: JWT = {
		sub: input.userId,
		email: input.email,
	};

	const options = {
		expiresIn,
		issuer: 'rewardingPlatform',
		audience: 'rewardingPlatform:auth',
	};

	return jwt.sign(token, secret, options);
}

export function validate(accessToken: string, secret: string) {
	try {
		const options: jwt.VerifyOptions = {
			algorithms: ['HS256'],
			issuer: 'rewardingPlatform',
			audience: 'rewardingPlatform:auth',
		};
		const payload = jwt.verify(accessToken, secret, options);
		return payload;
	} catch (e) {
		if (e.name === 'TokenExpiredError') throw new UnauthorizedException('Access token is expired');
		if (e.name === 'JsonWebTokenError') throw new UnauthorizedException('Access token is invalid');
		throw new UnauthorizedException();
	}
}

export type JWT = {
	sub: string;
	email: string;
};

export type createToken = {
	userId: string;
	email: string;
};
