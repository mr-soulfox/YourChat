import {WebSocketServer} from 'ws';
import {oAuthConnection} from './functions/oAuthConnection';
import {saveMsg} from './functions/saveMsg';
import {roomsObj} from './cache/rooms';
import {msgObj} from './cache/msg';
import {organizeMsg} from './functions/organizeMsg';

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

		saveMsg(
			msgObj,
			'create',
			String(req.url?.split('/')[2]),
			String(req.url?.split('/')[1])
		);

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

			msgObj.msgCache.forEach((msg, ui) => {
				if (msg.name === connectionDetails.path) {
					msgObj.msgCache[ui].msg.forEach((user, li) => {
						if (user.user.jwtId === oAuth) {
							msgObj.msgCache[ui].msg[li].user.allMsg = organizeMsg(
								String(connectionDetails.body),
								user.user.allMsg
							);

							return;
						}

						msgObj.msgCache[ui].msg[li].user.jwtId = oAuth;
						msgObj.msgCache[ui].msg[li].user.allMsg = organizeMsg(
							String(connectionDetails.body),
							user.user.allMsg
						);
					});
				}
			});
		});

		ws.on('close', (code, reason) => {
			saveMsg(msgObj, 'update');

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
