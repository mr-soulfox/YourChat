import crypto from 'crypto';

interface DecryptedMsg {
	newDatabase: Array<any>;
}

export function decryptMessages(database: Array<any>): DecryptedMsg {
	const newDatabase: Array<any> = [];

	database.forEach((user) => {
		newDatabase.push({
			...user,
			msg: user.msg.split(';'),
		});
	});

	return {
		newDatabase: newDatabase,
	};
}
