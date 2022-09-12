import {WebSocketServer} from 'ws';
import {oAuth, oAuthConnection} from './functions/oAuthConnection';

interface ConnectionDetails {
	type: string;
	body: Object | oAuth | any;
}

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws) => {
		ws.on('message', (body, isBinary) => {
			const connectionDetails: ConnectionDetails = JSON.parse(body.toString());

			if (connectionDetails.type === 'connect') {
				const body: oAuth = connectionDetails.body;
				oAuthConnection(body, ws);
				//...
			}

			if (connectionDetails.type === 'text') {
				[...socket.clients]
					.filter((c) => c !== ws)
					.forEach((c) => {
						c.send(connectionDetails.body);
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
