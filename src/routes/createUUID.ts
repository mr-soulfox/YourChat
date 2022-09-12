import {v4 as uuidV4} from 'uuid';

interface CreateUUID {
	uuid: string;
}

export function createUUID(): CreateUUID {
	const uuid = uuidV4();

	return {uuid: uuid};
}
