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
		const result = await sqlClient.message('', userId, roomId, 'update');
		await sqlClient.disconnect();
		console.log(result);

		return;
	}

	msg.msgCache.forEach((msg: any) => {
		roomId = msg.name;

		msg.msg.user.forEach(async (user: Msg) => {
			userId = user.user.jwtId;
			msg = user.user.allMsg;
			const result = await sqlClient.message(msg, userId, roomId, 'update');

			console.log(result);
		});
	});

	await sqlClient.disconnect();
}
