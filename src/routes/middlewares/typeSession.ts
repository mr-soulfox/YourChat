import {Request, Response, NextFunction} from 'express';

export function typeSession(req: Request, res: Response, next: NextFunction) {
	if (req.path != '/create-session') {
		next();
	}

	if (Number(req.body.duration) > 0) {
		const numDuration = Number(req.body.duration);
		req.body = {
			...req.body,
			typeSession: String(60 * 60 * 24 * numDuration),
		};

		next();
	}
}
