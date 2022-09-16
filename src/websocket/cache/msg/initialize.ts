import {msgObj} from '.';
import {SqlClient} from '../../../database/client';

export async function initializeMsgInDatabase() {
	const sqlClient = new SqlClient();
	const msg = await sqlClient.message('', '', '', 'alreadyAll');
	await sqlClient.disconnect();

	msg.info.database.forEach((msg: any, i: any) => {
		msgObj.msgCache.push({
			name: String(msg.roomId),
			msg: [
				{
					user: {
						uuid: String(msg.userId),
						allMsg: String(msg.msg),
					},
				},
			],
		});
	});

	console.log('Messages initialized successfully');
}
