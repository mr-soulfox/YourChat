import express from 'express';
import {PrismaClient} from './database/prisma/prismaClient';
import {router} from './routes';
import {WebSocket} from './websocket';
import cors from 'cors';
import helmet from 'helmet';
import {InitializeCache} from './websocket/cache/connections/initialize';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({origin: process.env.CORS_ORIGIN || '*'}));
app.use(helmet());
app.use(router);

const serverHttp = app.listen(port, () => {
	const initialize = new InitializeCache();
	initialize.initRoomsCache();
	initialize.initMsgCache();

	console.log('Server is running on PORT', port);
});

export const prismaClient = new PrismaClient();
new WebSocket(serverHttp);
