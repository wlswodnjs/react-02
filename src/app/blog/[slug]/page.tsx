import { posts } from "../posts";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return <h1>게시글을 찾을 수 없습니다.</h1>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
