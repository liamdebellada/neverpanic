import { describe, expect, it } from "bun:test";
import { n } from ".";

describe("safeReturn", () => {
  it("should catch any thrown errors and return success false", async () => {
    const result = await n.safeReturn(async () => {
      throw new Error("Unexpected error.");
    });

    expect(result.success).toBe(false);
  });

  it("should call and return the value from the error handler if an error is thrown", async () => {
    const expectedErrorMessage = "an-unknown-error-occured" as const;
    const result = await n.safeReturn(
      async () => {
        throw new Error("Unexpected error.");
      },
      () => expectedErrorMessage
    );

    if (result.success) throw new Error("Result should not be success.");

    expect(result.success).toBe(false);
    expect(result.error).toBe(expectedErrorMessage);
  });

  it("should return the success result of the callback if it doesn't throw", async () => {
    const expectedData = "some data" as const;

    const result = await n.safeReturn(async () => {
      return { success: true, data: expectedData };
    });

    if (!result.success) throw new Error("Result should be success.");

    expect(result.success).toBe(true);
    expect(result.data).toBe(expectedData);
  });

  it("should return the error result of the callback if it doesn't throw", async () => {
    const expectedError = "some-error" as const;

    const result = await n.safeReturn(async () => {
      return { success: false, error: expectedError };
    });

    if (result.success) throw new Error("Result should not be success.");

    expect(result.success).toBe(false);
    expect(result.error).toBe(expectedError);
  });
});
