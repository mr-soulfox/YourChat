import express from 'express';
import {PrismaClient} from './database/prisma/client';
import {router} from './routes';
import {WebSocket} from './websocket';
import cors from 'cors';
import helmet from 'helmet';
import {initializeRoomsInDatabase} from './websocket/cache/rooms/initialize';
import {initializeMsgInDatabase} from './websocket/cache/msg/initialize';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({origin: process.env.CORS_ORIGIN || '*'}));
app.use(helmet());
app.use(router);

const serverHttp = app.listen(port, () => {
	initializeRoomsInDatabase();
	initializeMsgInDatabase();
	console.log('Server is running on PORT', port);
});

export const prismaClient = new PrismaClient();
new WebSocket(serverHttp);
