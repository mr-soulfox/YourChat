import {PrismaClient} from '../prisma/prismaClient';
import {MessagesDB} from '../prisma/types';
import {Return} from './type';

export async function messageDBInteraction(
	client: PrismaClient,
	params: MessagesDB,
	type: string
): Promise<Return> {
	if (type === 'delete') {
		const msgDetails = await client.message.findFirst({
			where: {
				AND: {
					userId: params.userId,
					roomId: params.roomId,
				},
			},
		});

		try {
			const result = await client.message.delete({
				where: {
					id: msgDetails?.id,
				},
			});

			return {complete: true, info: result};
		} catch (err) {
			return {complete: false, info: err, error: true};
		}
	}

	if (type === 'create') {
		const result = await client.message.findFirst({
			where: {
				AND: {
					userId: params.userId,
					roomId: params.roomId,
				},
			},
		});

		if (result == null || result == undefined) {
			try {
				await client.message.create({
					data: params,
				});
			} catch (err) {
				console.log(err);
			}
		}
	}

	if (type === 'update') {
		const result = await client.message.findFirst({
			where: {
				AND: {
					userId: params.userId,
					roomId: params.roomId,
				},
			},
		});

		if (result != null || result != undefined) {
			try {
				await client.message.update({
					where: {
						id: Number(result?.id),
					},
					data: {
						msg: params.msg,
					},
				});
			} catch (err) {
				//Ignore this error
			}
		}
	}

	if (type === 'all') {
		const message = await client.message.findMany({
			where: {
				roomId: params.roomId,
			},
		});

		return {complete: true, info: message};
	}

	if (type === 'alreadyAll') {
		const message = await client.message.findMany();
		return {complete: true, info: message};
	}

	const message = await client.message.findFirst({
		where: {
			roomId: params.roomId,
		},
	});

	return message != undefined ? {complete: true, info: message} : {complete: false};
}
