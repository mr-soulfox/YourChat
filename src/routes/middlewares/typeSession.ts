import {Request, Response, NextFunction} from 'express';

export function typeSession(req: Request, res: Response, next: NextFunction) {
	if (req.body.duration) {
		const numDuration = Number(req.body.duration);
		req.headers.typeSession = String(60 * 60 * 24 * numDuration);

		next();
	}

	res.json({
		error: "Days duration don't sended in body",
	});
}
