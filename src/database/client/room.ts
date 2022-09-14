import {PrismaClient} from '../prisma/client';
import {RoomDB} from '../prisma/types';
import {Return} from './type';

export async function roomDBInteraction(
	client: PrismaClient,
	params: RoomDB,
	type: string
): Promise<Return> {
	if (type === 'delete') {
		try {
			await client.room.delete({
				where: {
					roomId: params.roomId,
				},
			});
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
		const rooms = await client.room.findMany({
			include: {
				msg: true,
			},
		});

		return {complete: true, info: rooms};
	}

	const room = await client.room.findUnique({
		where: {
			roomId: params.roomId,
		},
		include: {
			msg: true,
		},
	});

	return room != undefined ? {complete: true, info: room} : {complete: false};
}
