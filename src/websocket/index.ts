import {Server} from 'http';
import {Server as WebSocketServer} from 'ws';
import {setMethods} from './setMethods';

export class WebSocket {
	socket: WebSocketServer;

	constructor(serverOpt: Server) {
		this.socket = new WebSocketServer({
			server: serverOpt,
		});

		console.log(`Web Socket Server is running on ${process.env.PORT || 3000}`);

		setMethods(this.socket);
	}
}
