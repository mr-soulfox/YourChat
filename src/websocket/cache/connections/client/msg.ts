import {Msg, MsgCache} from './msg-type';

interface Params {
	message: string;
	userId: string;
	roomId: string;
}

export const msgCache: MsgCache = {
	cache: {},
	insertMsg: (newMsg: Params) => {
		const msgCacheExist = msgCache.cache[newMsg.userId];

		if (msgCacheExist) return;

		msgCache.cache = {
			...msgCache.cache,
			[newMsg.userId]: {
				[newMsg.roomId]: newMsg.roomId,
				msg: newMsg.message,
			},
		};
	},
};
