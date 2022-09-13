import jwt from 'jsonwebtoken';
import {WebSocket} from 'ws';

export function oAuthConnection(token: string, ws: WebSocket) {
	const decode: any = jwt.decode(token);
	const valid = Date.now() >= decode.exp * 1000;

	if (!valid) {
		ws.close(
			3000,
			JSON.stringify({
				expired: !valid,
				msg: 'oAuth: Your token has expired, please try again or refresh token',
			})
		);
	}
}
