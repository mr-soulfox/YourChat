import {prismaClient} from '../../index';
import {prisma, PrismaClient} from '../prisma/prismaClient';
import {log} from './function/log';
import {messageDBInteraction} from './message';
import {permissionDBInteraction} from './permission';
import {roomDBInteraction} from './room';

export class SqlClient {
	private readonly client: PrismaClient;

	constructor() {
		this.client = prismaClient;
	}

	async disconnect() {
		await this.client.$disconnect();
	}

	async permission(apiKey: string, originUrl: string, type: string) {
		const params = {
			apiKey: apiKey,
			originUrl: originUrl,
		};

		const {complete, info, error} = await permissionDBInteraction(
			this.client,
			params,
			type
		);
		return log(complete, info, error == true);
	}

	async rooms(roomId: string, type: string, save: boolean = false) {
		const params = {
			roomId: roomId,
			save: save,
		};

		const {complete, info, error} = await roomDBInteraction(this.client, params, type);
		return log(complete, info, error == true);
	}

	async message(msg: string, userId: string, roomId: string, type: string) {
		const params = {
			msg: msg,
			userId: userId,
			roomId: roomId,
		};

		const {complete, info, error} = await messageDBInteraction(this.client, params, type);
		return log(complete, info, error == true);
	}
}
