import {Request, Response, NextFunction} from 'express';

export function oAuth(req: Request, res: Response, next: NextFunction) {
	if (req.headers.authorization != 'DEV:123') {
		res.json({Error: 'Bad Request, not authorization'});
	}

	next();
}
