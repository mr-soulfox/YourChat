interface DecryptedMsg {
	msg: Array<String>;
}

export function decryptMessages(msg: String): DecryptedMsg {
	return {
		msg: msg.split(';'),
	};
}
