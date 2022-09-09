import {Router} from 'express';
import {generateSessionKey} from './jwt';
import {createChat} from './routes/createChat';
import {typeSession} from './routes/middlewares/typeSession';

export const router = Router();

router.use(typeSession);

router.get('/', (req, res) => {
	res.send('Welcome to Your Chat API.');
});

router.post('/create-chat', (req, res) => {
	const {uuid, path} = createChat();
	const content = {
		sessionType: Number(req.headers.typeSession),
		uuid: uuid,
		path: path,
		originUrl: req.body.originUrl,
		created_at: Date.now(),
	};

	const token = generateSessionKey(content, req.body.privateKey, content.sessionType);

	res.json({
		token: token,
		path: path,
	});
});
