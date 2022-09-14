import {roomsObj} from '.';
import {SqlClient} from '../../../database/client';

export async function initializeRoomsInDatabase() {
	const sqlClient = new SqlClient();
	const rooms = await sqlClient.rooms('', 'all');
	await sqlClient.disconnect();

	rooms.info.database.forEach((room, i) => {
		roomsObj.roomsMethods.push({
			name: String(room.roomId),
			clients: [],
		});
	});

	console.log('Rooms initialized successfully');
}
