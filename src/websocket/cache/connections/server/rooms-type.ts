import {WebSocket} from 'ws';

export interface Rooms {
	name?: string;
	save: boolean;
	clients: WebSocket[];
}

export interface RoomsCache {
	allConnections: {[roomsId: string]: Rooms};
	readonly insertRoom: Function;
}
