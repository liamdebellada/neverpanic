export type Result<T, E = unknown> =
  | {
      success: true;
      data: T;
    }
  | { success: false; error: E };

/**
 * Create a safe function from an unsafe one.
 *
 * @param cb - The async function to wrap.
 * @param [eh] - Optional fallback error handler.
 * @returns A new function that returns a typesafe Result.
 *
 * @example
 * const getUser = n.safeFn(
 *   async (id: string) => {
 *     const res = await fetch(`https://example.com/users/${id}`);
 *     if (!res.ok) return { success: false, error: "FAILED_TO_FETCH" };
 *
 *     return { success: true, data: await res.json() };
 *   },
 *   () => "FAILED_TO_GET_USER"
 * );
 *
 * const getUserResult = await getUser("some-user-id");
 * if (!getUserResult.success) {
 *   console.error(getUserResult.error);
 * } else {
 *   console.log(getUserResult.data);
 * }
 */
function safeFn<T, A extends unknown[], E = never, EH = null>(
  cb: (...args: A) => Promise<Result<T, E>>,
  eh?: (err: unknown) => EH
): (...args: A) => Promise<Result<T, E | EH>> {
  return async (...args: A) => {
    try {
      return await cb(...args);
    } catch (e) {
      return {
        success: false,
        error: eh?.(e) ?? null,
      } as Result<T, E | EH>;
    }
  };
}

/**
 * Run an unsafe function, handle any errors and return a Result.
 *
 * @param cb - The async function to call.
 * @param [eh] - Optional fallback error handler.
 * @returns The awaited return value of cb.
 *
 * @example
 * const user = await n.fromUnsafe(() => db.findUser('some-user-id'), () => 'FAILED_T0_FIND_USER')
 * if (!user.success) {
 * 	console.error(user.error)
 * } else {
 * 	console.log(user)
 * }
 */
async function fromUnsafe<T, E = null>(
  cb: () => T,
  eh?: (err: unknown) => E
): Promise<Result<Awaited<T>, E>> {
  try {
    const result = await cb();

    return {
      success: true,
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      error: eh?.(e) ?? null,
    } as Result<Awaited<T>, E>;
  }
}

export const n = { safeFn, fromUnsafe };
