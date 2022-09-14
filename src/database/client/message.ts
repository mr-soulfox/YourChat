import {PrismaClient} from '../prisma/client';
import {MessagesDB} from '../prisma/types';
import {Return} from './type';

export async function messageDBInteraction(
	client: PrismaClient,
	params: MessagesDB,
	type: string
): Promise<Return> {
	if (type === 'delete') {
		try {
			await client.message.delete({
				where: {
					roomId: params.roomId,
				},
			});
		} catch (err) {
			return {complete: false, info: err, error: true};
		}
	}

	if (type === 'create') {
		await client.message.create({
			data: params,
		});
	}

	if (type === 'update') {
		await client.message.update({
			where: {
				roomId: params.roomId,
			},
			data: params,
		});
	}

	if (type === 'all') {
		const message = await client.message.findMany({
			include: {
				room: true,
			},
		});

		return {complete: true, info: message};
	}

	const message = await client.message.findUnique({
		where: {
			roomId: params.roomId,
		},
	});

	return message != undefined ? {complete: true, info: message} : {complete: false};
}
