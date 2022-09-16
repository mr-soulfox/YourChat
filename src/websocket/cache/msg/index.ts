export interface Msg {
	user: {
		uuid: string;
		allMsg: string;
	};
}

export interface MsgObj {
	msgCache: Array<{
		name: string;
		msg: Array<Msg>;
	}>;
}

export const msgObj: MsgObj = {
	msgCache: [],
};
