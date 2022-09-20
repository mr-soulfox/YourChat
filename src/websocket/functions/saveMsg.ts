import {SqlClient} from '../../database/client';
import {MsgObj} from '../cache/msg';
import {Msg} from '../cache/msg';

export async function saveMsg(
	msg: MsgObj,
	type: string,
	userId: string = '',
	roomId: string = ''
): Promise<void> {
	const sqlClient = new SqlClient();

	if (type == 'create') {
		await sqlClient.message('', userId, roomId, 'create');
		await sqlClient.disconnect();

		return;
	}

	msg.msgCache.forEach((room: any, i) => {
		const roomId = room.name;

		msg.msgCache[i].msg.forEach(async (user: Msg) => {
			await sqlClient.message(user.user.allMsg, user.user.uuid, roomId, 'update');
		});
	});

	await sqlClient.disconnect();
}
