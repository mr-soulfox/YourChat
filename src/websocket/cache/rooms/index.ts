import {WebSocket} from 'ws';

export interface RoomsObj {
	roomsMethods: Array<{
		name: string;
		clients: Array<WebSocket>;
	}>;
}

export const roomsObj: RoomsObj = {
	roomsMethods: [
		{
			name: 'development',
			clients: [],
		},
	],
};
