export interface PermissionDB {
	apiKey: string;
	originUrl: string;
}

export interface RoomDB {
	roomId: string;
	save: boolean;
	created_at?: Date;
}

export interface MessagesDB {
	msg: string;
	userId: string;
	roomId: string;
}
