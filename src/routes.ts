import {Router} from 'express';
import {generateSessionKey} from './jwt';
import {createUUID} from './routes/createUUID';
import {typeSession} from './routes/middlewares/typeSession';

export const router = Router();
router.use(typeSession);

router.get('/', (req, res) => {
	res.send('Welcome to Your Chat API.');
});

router.post('/create-session', (req, res) => {
	const {uuid} = createUUID();
	const content = {
		sessionType: Number(req.body.typeSession),
		uuid: uuid,
		originUrl: req.body.originUrl,
		created_at: Date.now(),
	};

	const token = generateSessionKey(content, req.body.privateKey, content.sessionType);

	res.json({
		token: token,
	});
});
