type Result<T, E = unknown> =
  | {
      success: true;
      data: T;
    }
  | { success: false; error: E };

async function safeReturn<T, E = never, EH = null>(
  cb: () => Promise<Result<T, E>>,
  eh?: (err: unknown) => EH
): Promise<Result<T, E | EH>> {
  try {
    return await cb();
  } catch (e) {
    return {
      success: false,
      error: eh ? eh(e) : null,
    } as Result<T, E | EH>;
  }
}

export const n = { safeReturn };
