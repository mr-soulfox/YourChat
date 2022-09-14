import {Router} from 'express';
import {generateSessionKey} from './jwt';
import {createUUID} from './routes/createUUID';
import {oAuth} from './routes/middlewares/oAuth';
import {roomsObj} from './websocket/cache/rooms';
import {SqlClient} from './database/client';
import {createApiKey} from './routes/createApiKey';
import randomstring from 'randomstring';

export const router = Router();

router.get('/', (req, res) => {
	res.send(
		'Welcome to Your Chat API. see the documentation in https://docsyourchat.netlify.app/'
	);
});

router.use(oAuth);

router.get('/adm/find/api-key/:all', async (req, res) => {
	const sqlClient = new SqlClient();
	const result = await sqlClient.permission(
		req.body.apiKey,
		'',
		req.params.all ? 'all' : 'find'
	);
	await sqlClient.disconnect();

	res.status(result.status).json(result);
});

router.post('/adm/create/api-key', async (req, res) => {
	const apiKey = createApiKey(req.body.originUrl);

	const sqlClient = new SqlClient();
	const result = await sqlClient.permission(apiKey, req.body.originUrl, 'create');
	sqlClient.disconnect();

	res.status(result.status).json(result);
});

router.delete('/adm/:apiKey/delete', async (req, res) => {
	const sqlClient = new SqlClient();
	const result = await sqlClient.permission(req.params.apiKey, '', 'delete');
	await sqlClient.disconnect();

	res.status(result.status).json(result);
});

router.get('/msg/saved/:roomId', async (req, res) => {
	const sqlClient = new SqlClient();
	const result = await sqlClient.message('', '', String(req.params.roomId), 'find');
	await sqlClient.disconnect();

	res.status(result.status).json(result);
});

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
		userId: randomstring.generate({
			capitalization: 'lowercase',
			charset: 'alphanumeric',
			length: 13,
		}),
	});
});

router.post('/create-room', async (req, res) => {
	const {uuid} = createUUID();
	const sqlClient = new SqlClient();
	const result = await sqlClient.rooms(uuid, 'create', req.body.save);
	await sqlClient.disconnect();

	roomsObj.roomsMethods.push({
		name: uuid,
		clients: [],
	});

	res.status(result.status).json(result);
});
