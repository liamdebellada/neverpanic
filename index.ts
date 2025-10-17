type Result<T, E = unknown> =
	| {
			success: true;
			data: T;
	  }
	| { success: false; error: E };

async function safeReturn<T, E>(
	cb: () => Promise<Result<T, E>> | Result<T, E>,
): Promise<Result<T, E | null>>;
async function safeReturn<T, E, H>(
	cb: () => Promise<Result<T, E>> | Result<T, E>,
	eh: (err: unknown) => H,
): Promise<Result<T, E | H>>;
async function safeReturn<T, E, H>(
	cb: () => Promise<Result<T, E>> | Result<T, E>,
	eh?: (err: unknown) => H,
): Promise<Result<T, E | H | null>> {
	try {
		return await cb();
	} catch (e) {
		return {
			success: false,
			error: eh?.(e) ?? null,
		};
	}
}

export const o = { safeReturn };