import jwt from 'jsonwebtoken';

interface Content {
	sessionType: number;
	uuid: string;
	originUrl: string;
	created_at: number;
}

export function generateSessionKey(
	content: Content,
	privateKey: string,
	duration: number
): string {
	const token = jwt.sign(
		{
			exp: Math.floor(content.created_at / 1000) + duration,
			data: content,
		},
		privateKey
	);

	return token;
}
