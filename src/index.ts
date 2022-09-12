import express from 'express';
import {router} from './routes';
import {WebSocket} from './websocket';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({origin: process.env.CORS_ORIGIN || '*'}));
app.use(helmet());
app.use(router);

const serverHttp = app.listen(port, () => {
	console.log('Server is running on PORT', port);
});
new WebSocket(serverHttp);
