"use client";

import { Suspense } from "react";
import useSWR from "swr";

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

type Photo = {
  id: string;
  title: string;
};

export default function Page() {
  const { data, error, isLoading } = useSWR<Photo[]>(
    "https://jsonplaceholder.typicode.com/photos",
    fetcher,
  );

  if (isLoading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1>Blog2 Page - Photo Titles</h1>
      <ul>
        <Suspense fallback="Loading posts">
          {data?.map((post: { id: string; title: string }) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </Suspense>
      </ul>
    </>
  );
}
