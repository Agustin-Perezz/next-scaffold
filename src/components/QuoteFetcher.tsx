"use client";

import { useFetch } from "@/hooks/useFetch";

type Quote = {
  id: number;
  content: string;
  author: string;
};

export function QuoteFetcher() {
  const { data, loading, error } = useFetch<Quote>("/api/quote");

  if (loading) {
    return <p aria-busy="true">Loading quote...</p>;
  }
  if (error) {
    return <p role="alert">{error}</p>;
  }
  if (!data) {
    return <p>No quote found</p>;
  }

  return (
    <blockquote>
      <p>{data.content}</p>
      <footer>— {data.author}</footer>
    </blockquote>
  );
}
