import {SqlClient} from '../../database/client';
import {MsgCache} from '../cache/connections/client/msg-type';

export async function saveMsg(
	msg: MsgCache,
	type: string,
	userId: string = '',
	roomId: string = ''
): Promise<void> {
	const sqlClient = new SqlClient();

	if (type == 'create') {
		await sqlClient.message('', userId, roomId, 'create');
	}

	if (type == 'update') {
		const userId = Object.keys(msg.cache);

		userId.forEach(async (user, i) => {
			const roomId = Object.keys(msg.cache[user]);
			await sqlClient.message(msg.cache[user].msg, user, roomId[0], 'update');
		});
	}

	await sqlClient.disconnect();
}
