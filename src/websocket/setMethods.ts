import {WebSocketServer} from 'ws';

export function setMethods(socket: WebSocketServer) {
	socket.on('connection', (ws) => {
		console.log('Um novo maluco entro na sala');
	});
}
