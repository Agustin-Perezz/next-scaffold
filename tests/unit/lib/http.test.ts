import { describe, expect, it } from "vitest";

import { INITIAL_FETCH_STATE, parseJson } from "@/lib/utils/http";

describe("parseJson", () => {
  it("returns parsed JSON on a successful response", async () => {
    const response = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ name: "test" }),
    } as unknown as Response;

    await expect(parseJson(response)).resolves.toEqual({ name: "test" });
  });

  it("throws on a non-ok response", async () => {
    const response = {
      ok: false,
      status: 403,
      statusText: "Forbidden",
    } as unknown as Response;

    await expect(parseJson(response)).rejects.toThrow("HTTP 403: Forbidden");
  });
});

describe("INITIAL_FETCH_STATE", () => {
  it("starts in a loading state with no data or error", () => {
    expect(INITIAL_FETCH_STATE).toEqual({
      data: null,
      loading: true,
      error: null,
    });
  });
});
