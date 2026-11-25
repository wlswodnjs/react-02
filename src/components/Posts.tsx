"use client";

import { use } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Posts({ posts }: { posts: Promise<Post[]> }) {
  const allPosts = use(posts);

  return (
    <section>
      <h1>게시글 목록</h1>
      <ul>
        {allPosts.map((post) => (
          <li key={post.id}>
            <article>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
