export function organizeMsg(msg: string, allMsg: string): string {
	return `${allMsg}${allMsg == '' ? '' : ';'}${msg}`;
}
