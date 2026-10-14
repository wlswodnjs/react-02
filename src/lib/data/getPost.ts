type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
};

const posts: Post[] = [
  {
    id: "nextjs",
    title: "Next.js",
    content: "Next.js is great",
    likes: 5,
  },
  {
    id: "routing",
    title: "Routing",
    content: "Route is App Router",
    likes: 3,
  },
];

export async function getPost(id: string): Promise<Post> {
  await new Promise((r) => setTimeout(r, 100));
  const post = posts.find((p) => p.id === id);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

export async function getPosts(): Promise<Post[]> {
  await new Promise((r) => setTimeout(r, 50));
  return posts;
}
