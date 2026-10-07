import Link from "next/link";
import { posts } from "./posts";

export default function Home() {
  return (
    <div>
      <h1>블로그 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog3/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
