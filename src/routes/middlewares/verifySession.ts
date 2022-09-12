import {Request, Response, NextFunction} from 'express';

export function verifySession(req: Request, res: Response, next: NextFunction) {
	if (req.method == 'POST') {
		next();
	}

	next();
}
