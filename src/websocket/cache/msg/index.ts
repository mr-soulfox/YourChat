export interface Msg {
	user: {
		jwtId: string;
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
