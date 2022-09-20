export interface Msg {
	[userId: string]: {
		[roomId: string]: string;
		msg: string;
	};
}

export interface MsgCache {
	cache: Msg;
	readonly insertMsg: Function;
}
