import {SqlClient} from '../../../database/client';
import {Message, Room} from '../../../database/prisma/prismaClient';
import {msgCache} from './client/msg';
import {MsgCache} from './client/msg-type';
import {roomsCache} from './server/rooms';
import {Rooms, RoomsCache} from './server/rooms-type';

export class InitializeCache {
	prismaClient = new SqlClient();
	roomsCache: RoomsCache = roomsCache;
	msgCache: MsgCache = msgCache;

	async initRoomsCache(): Promise<void> {
		const rooms: Room[] = await (await this.prismaClient.rooms('', 'all')).info.database;
		await this.prismaClient.disconnect();

		rooms.forEach((room) => {
			const params: Rooms = {
				name: room.roomId,
				save: room.save,
				clients: [],
			};

			roomsCache.insertRoom(params);
		});

		console.log('Rooms Cache: Initialized with success');
	}

	async initMsgCache(): Promise<void> {
		const msg: Message[] = await (
			await this.prismaClient.message('', '', '', 'alreadyAll')
		).info.database;
		await this.prismaClient.disconnect();

		msg.forEach((msg) => {
			const params = {
				message: msg.msg,
				userId: msg.userId,
				roomId: msg.roomId,
			};

			msgCache.insertMsg(params);
		});

		console.log('Messages Cache: Initialized with success');
	}
}
