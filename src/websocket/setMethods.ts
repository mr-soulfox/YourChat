import {WebSocketServer} from 'ws';
import {oAuthConnection} from './functions/oAuthConnection';
import {roomsObj} from './rooms';

interface ConnectionDetails {
	type: string;
	token: string;
	path: string;
	body: Object | any;
}

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws, req) => {
		console.log(req.url);

		roomsObj.roomsMethods.forEach((room, i) => {
			if (room.name === req.url?.split('/')[1]) {
				roomsObj.roomsMethods[i].clients.push(ws);
			}
		});

		ws.on('message', (body) => {
			const connectionDetails: ConnectionDetails = JSON.parse(body.toString());
			const oAuth = connectionDetails.token;
			oAuthConnection(oAuth, ws);

			if (connectionDetails.type === 'text') {
				roomsObj.roomsMethods.forEach((room, i) => {
					if (room.name === connectionDetails.path) {
						roomsObj.roomsMethods[i].clients.forEach((c) => {
							if (c != ws) {
								c.send(
									JSON.stringify({
										text: connectionDetails.body,
									})
								);
							}
						});
					}
				});
			}
		});

		ws.on('close', (code, reason) => {
			try {
				ws.emit(
					'close',
					JSON.stringify({
						code: code.toString(),
						reason: reason.toString(),
					})
				);
			} catch (err) {
				console.log('Unexpected close');
			}
		});

		ws.on('error', (err) => {
			ws.emit(
				'error',
				JSON.stringify({
					msg: 'Error occurrent in connection',
					error: err.toString(),
				})
			);
		});
	});
}
