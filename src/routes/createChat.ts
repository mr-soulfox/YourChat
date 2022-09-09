import {v4 as uuidV4} from 'uuid';
import {WebSocket} from '../websocket';

interface CreateChat {
	uuid: string;
	path: string;
}

export function createChat(): CreateChat {
	const uuid = uuidV4();
	const socket = new WebSocket(`/socket/chat/${uuid}`);

	return {uuid: uuid, path: `/socket/chat/${uuid}`};
}
