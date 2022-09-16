import {Request, Response, NextFunction} from 'express';
import {SqlClient} from '../../database/client';

export async function oAuth(req: Request, res: Response, next: NextFunction) {
	const sqlClient = new SqlClient();
	const allKeys = await sqlClient.permission('', '', 'all');
	await sqlClient.disconnect();

	const sameKey = allKeys.info.database.filter((obj: any) => {
		return String(obj.apiKey) === req.headers.authorization;
	});

	if (
		sameKey.length == 0 &&
		!(req.headers.authorization == String(process.env.API_KEY))
	) {
		res.status(400).json({Error: 'Bad Request, not authorization'});
		return;
	}

	next();
}
