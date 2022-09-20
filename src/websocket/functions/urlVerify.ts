import {msgCache} from '../cache/connections/client/msg';
import {roomsCache} from '../cache/connections/server/rooms';

export function urlVerify(url: string): boolean {
	const urlSplitted = url.split('/');

	if (url === '') return false;
	if (urlSplitted.length != 3) return false;
	if (urlSplitted[1] === '') return false;
	if (urlSplitted[2] === '') return false;

	return true;
}
