"use client";

import { useEffect, useState } from "react";
import type { FetchState } from "@/lib/utils/http";
import { INITIAL_FETCH_STATE, parseJson } from "@/lib/utils/http";

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>(INITIAL_FETCH_STATE);

  useEffect(() => {
    let cancelled = false;
    setState({ ...INITIAL_FETCH_STATE, loading: true });

    fetch(url)
      .then((res) => parseJson<T>(res))
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
