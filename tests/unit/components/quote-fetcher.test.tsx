import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuoteFetcher } from "@/components/QuoteFetcher";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("QuoteFetcher", () => {
  it("shows loading state initially", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1, content: "Hi", author: "Me" }),
      }),
    );

    render(<QuoteFetcher />);
    expect(screen.getByText("Loading quote...")).toBeInTheDocument();
  });

  it("renders the quote after a successful fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: 42,
            content: "Stay hungry, stay foolish",
            author: "Steve Jobs",
          }),
      }),
    );

    render(<QuoteFetcher />);

    expect(
      await screen.findByText("Stay hungry, stay foolish"),
    ).toBeInTheDocument();
    expect(screen.getByText("— Steve Jobs")).toBeInTheDocument();
  });

  it("renders the error message on a failed fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({}),
      }),
    );

    render(<QuoteFetcher />);
    expect(await screen.findByText("HTTP 404: Not Found")).toBeInTheDocument();
  });
});
