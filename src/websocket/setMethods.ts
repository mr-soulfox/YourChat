import {WebSocketServer} from 'ws';
import {oAuthConnection} from './functions/oAuthConnection';
import {saveMsg} from './functions/saveMsg';
import {roomsObj} from './cache/rooms';
import {msgObj} from './cache/msg';
import {organizeMsg} from './functions/organizeMsg';
import {SqlClient} from '../database/client';

interface ConnectionDetails {
	type: string;
	token: string;
	path: string;
	body: Object | any;
}

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws, req) => {
		console.log(req.url);

		new SqlClient().rooms(String(req.url?.split('/')[1]), 'find').then((result) => {
			if (result.status != 200) {
				ws.close(
					1000,
					JSON.stringify({
						code: 404,
						msg: "Failed to connect with server: RoomId don't exist",
					})
				);

				return;
			}

			if (result.status == 200) {
				roomsObj.roomsMethods.forEach((room, i) => {
					if (room.name === req.url?.split('/')[1]) {
						roomsObj.roomsMethods[i].clients.push(ws);
					}
				});

				msgObj.msgCache.forEach((room, i) => {
					const userExist = msgObj.msgCache[i].msg.map((user) => {
						if (user.user.uuid === String(req.url?.split('/')[2])) {
							return true;
						}
					});

					if (room.name === req.url?.split('/')[1] && userExist.length < 0) {
						msgObj.msgCache[i].msg.push({
							user: {
								uuid: String(req.url?.split('/')[2]),
								allMsg: '',
							},
						});
					}
				});

				saveMsg(
					msgObj,
					'create',
					String(req.url?.split('/')[2]),
					String(req.url?.split('/')[1])
				);
			}
		});

		ws.on('message', (body) => {
			const connectionDetails: ConnectionDetails = JSON.parse(body.toString());
			const oAuth = connectionDetails.token;
			oAuthConnection(oAuth, ws);

			if (connectionDetails.type === 'text') {
				if (connectionDetails.body === '') {
					return;
				}

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

				msgObj.msgCache.forEach((msg, ui) => {
					if (msg.name === connectionDetails.path) {
						msgObj.msgCache[ui].msg.forEach((user, li) => {
							if (user.user.uuid === String(req.url?.split('/')[2])) {
								msgObj.msgCache[ui].msg[li].user.allMsg = organizeMsg(
									String(connectionDetails.body),
									user.user.allMsg
								);
							}
						});
					}
				});
			}
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
