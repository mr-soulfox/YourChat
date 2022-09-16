interface Log {
	status: number;
	info: {
		msg: string;
		database: any;
	};
	error?: string;
}

export function log(comp: boolean, info: any, error: Boolean = false): Log {
	if (error) {
		return {
			status: 500,
			error: 'Internal Server Error on Database Operation',
			info: info,
		};
	}

	return {
		status: comp ? 200 : 400,
		info: {
			msg: comp ? 'Operation successful' : 'Operation failed',
			database: info,
		},
	};
}
