import {Rooms, RoomsCache} from './rooms-type';

export const roomsCache: RoomsCache = {
	allConnections: {
		development: {
			save: false,
			clients: [],
		},
	},

	insertRoom: (newRoom: Rooms) => {
		const roomExist =
			roomsCache.allConnections[String(newRoom?.name) as keyof typeof roomsCache];

		if (roomExist) return;

		roomsCache.allConnections = {
			...roomsCache.allConnections,
			[String(newRoom?.name) as keyof typeof roomsCache]: {
				save: newRoom.save,
				clients: [],
			},
		};
	},
};
