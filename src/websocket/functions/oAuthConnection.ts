import jwt from 'jsonwebtoken';
import {WebSocket} from 'ws';

export interface oAuth {
	token: string;
}

export function oAuthConnection(data: oAuth, ws: WebSocket) {
	const decode: any = jwt.decode(data.token);
	const valid = Date.now() <= decode.exp * 1000;

	if (!valid) {
		ws.close(
			3000,
			JSON.stringify({
				expired: !valid,
				msg: 'oAuth: Your token has expired, please try again or refresh token',
			})
		);
	}

	ws.send(
		JSON.stringify({
			expired: !valid,
			msg: 'oAuth: Your token is correct',
		})
	);
}
