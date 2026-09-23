import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>=== Root Layout Header ===</header>
        <nav>
          <Link href="/">Home</Link> | <Link href="/blog">Blog</Link> |{" "}
          <Link href="/products">Products</Link>
        </nav>
        <main>{children}</main>
        <footer>=== Root Layout Footer ===</footer>
      </body>
    </html>
  );
}
