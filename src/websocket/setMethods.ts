import {WebSocketServer} from 'ws';

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws) => {
		console.log('New user');

		ws.on('message', (data) => {
			console.log(data.toString());
		});
	});
}
