import {Request, Response, NextFunction} from 'express';

export function typeSession(req: Request, res: Response, next: NextFunction) {
	if (req.method != 'POST') {
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

	res.status(401).json({Error: "Don't create, bad request"});
}
