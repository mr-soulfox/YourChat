import crypto from 'crypto';
import randomString from 'randomstring';

export function createApiKey(originalUrl: string): string {
	const random = randomString.generate({
		length: 13,
		charset: 'alphanumeric',
		capitalization: 'lowercase',
	});
	const date = Date.now();

	return `${date}-${random}`;
}
