import {PrismaClient} from '../prisma/prismaClient';
import {PermissionDB} from '../prisma/types';
import {Return} from './type';

export async function permissionDBInteraction(
	client: PrismaClient,
	params: PermissionDB,
	type: string
): Promise<Return> {
	if (type === 'delete') {
		const permission = await client.permission.findFirst({
			where: {
				apiKey: params.apiKey,
			},
		});

		try {
			const result = await client.permission.delete({
				where: {
					id: Number(permission?.id),
				},
			});

			return {complete: true, info: result};
		} catch (err) {
			return {
				complete: false,
				info: err,
				error: true,
			};
		}
	}

	if (type === 'create') {
		await client.permission.create({
			data: params,
		});
	}

	if (type === 'all') {
		const allKeys = await client.permission.findMany();
		return {complete: true, info: allKeys};
	}

	const permission = await client.permission.findFirst({
		where: {
			apiKey: params.apiKey,
		},
	});

	return type != 'delete'
		? permission != undefined
			? {complete: true, info: permission}
			: {complete: false}
		: permission == undefined
		? {complete: true, info: permission}
		: {complete: false};
}
