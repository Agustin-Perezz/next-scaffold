import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "@/hooks/useFetch";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useFetch", () => {
  it("returns loading then data on a successful fetch", async () => {
    const payload = { id: 1, content: "Hello", author: "World" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(payload),
      }),
    );

    const { result } = renderHook(() => useFetch<typeof payload>("/api/quote"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  it("returns an error message on a failed fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.resolve({}),
      }),
    );

    const { result } = renderHook(() => useFetch<unknown>("/api/quote"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("HTTP 500: Internal Server Error");
  });

  it("returns a generic error when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network down")),
    );

    const { result } = renderHook(() => useFetch<unknown>("/api/quote"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network down");
  });
});
