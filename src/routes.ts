import {Router} from 'express';
import {generateSessionKey} from './jwt';
import {createUUID} from './routes/createUUID';
import {oAuth} from './routes/middlewares/oAuth';
import {typeSession} from './routes/middlewares/typeSession';

export const router = Router();

router.get('/', (req, res) => {
	res.send('Welcome to Your Chat API.');
});

router.use(typeSession);
router.use(oAuth);

router.post('/create-session', (req, res) => {
	const {uuid} = createUUID();
	const content: any = {
		saveMsg: req.body.save,
		uuid: uuid,
		originUrl: req.body.originUrl,
		created_at: Date.now(),
	};

	const token = generateSessionKey(
		content,
		req.body.privateKey,
		Number(req.body.duration)
	);

	res.json({
		token: token,
	});
});
