import {PrismaClient} from '../prisma/client';
import {RoomDB} from '../prisma/types';
import {Return} from './type';

export async function roomDBInteraction(
	client: PrismaClient,
	params: RoomDB,
	type: string
): Promise<Return> {
	if (type === 'delete') {
		const roomDetails = await client.room.findFirst({
			where: {
				roomId: params.roomId,
			},
		});

		try {
			const result = await client.room.delete({
				where: {
					id: roomDetails?.id,
				},
			});

			return {complete: true, info: result};
		} catch (err) {
			return {complete: false, info: err, error: true};
		}
	}

	if (type === 'create') {
		await client.room.create({
			data: params,
		});
	}

	if (type === 'all') {
		const rooms = await client.room.findMany({});

		return {complete: true, info: rooms};
	}

	const room = await client.room.findFirst({
		where: {
			roomId: params.roomId,
		},
	});

	return room != undefined ? {complete: true, info: room} : {complete: false};
}
