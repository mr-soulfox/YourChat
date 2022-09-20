import {WebSocketServer} from 'ws';
import {oAuthConnection} from './functions/oAuthConnection';
import {saveMsg} from './functions/saveMsg';
import {organizeMsg} from './functions/organizeMsg';
import {SqlClient} from '../database/client';
import {urlVerify} from './functions/urlVerify';
import {roomsCache} from './cache/connections/server/rooms';
import {msgCache} from './cache/connections/client/msg';

interface ConnectionDetails {
	type: string;
	token: string;
	path: string;
	body: Object | any;
}

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws, req) => {
		console.log(req.url);
		const pass = urlVerify(String(req.url));

		if (!pass) {
			ws.close(3000, "Your url is invalid: 'UserId don't exist on server'");

			return;
		}

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
				roomsCache.allConnections[
					String(req.url?.split('/')[1]) as keyof typeof roomsCache
				].clients.push(ws);

				const params = {
					message: '',
					userId: String(req.url?.split('/')[1]),
					roomId: String(req.url?.split('/')[2]),
				};

				msgCache.insertMsg(params);

				saveMsg(
					msgCache,
					'create',
					String(req.url?.split('/')[2]),
					String(req.url?.split('/')[1])
				);
			}
		});

		ws.on('message', (body) => {
			const connectionDetails: ConnectionDetails = JSON.parse(body.toString());
			const msgSended: string = connectionDetails.body;
			const oAuth = connectionDetails.token;
			oAuthConnection(oAuth, ws);

			if (connectionDetails.type === 'text') {
				if (msgSended === '') {
					return;
				}

				const connections =
					roomsCache.allConnections[
						String(req.url?.split('/')[1]) as keyof typeof roomsCache
					].clients;

				connections.forEach((client) => {
					if (client != ws) {
						client.send(
							JSON.stringify({
								text: msgSended.trim(),
							})
						);
					}
				});

				const params = {
					userId: String(req.url?.split('/')[2]),
					roomId: String(req.url?.split('/')[1]),
				};

				if (msgCache.cache[params.userId][params.roomId]) {
					msgCache.cache[params.userId].msg = organizeMsg(
						String(msgSended.trim()),
						msgCache.cache[params.userId].msg
					);

					console.log(msgCache);
				}
			}
		});

		ws.on('close', (code, reason) => {
			if (roomsCache.allConnections[String(req.url?.split('/')[1])].save) {
				saveMsg(msgCache, 'update');
			}

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
