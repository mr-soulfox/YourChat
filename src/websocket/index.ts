import {WebSocketServer} from 'ws';
import {setMethods} from './setMethods';

export class WebSocket {
	socket: WebSocketServer;

	constructor(path: string) {
		this.socket = new WebSocketServer({
			port: 3001,
			path: path,
		});

		setMethods(this.socket);
	}
}
