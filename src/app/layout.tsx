import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <p>=== Root Layout Header ===</p>
          <nav>
            <Link href="/">Home</Link> | <Link href="/counter">Counter</Link>
            <br />
            <br />
            Slug Page Menu : &nbsp;
            <Link href="/nextjs">nextjs</Link> &nbsp;|&nbsp;
            <Link href="/routing">routing</Link> &nbsp;|&nbsp;
            <Link href="/ssr-ssg">ssr-ssg</Link> &nbsp;|&nbsp;
            <Link href="/dynamic-routes">dynamic-routes</Link>
            <br />
          </nav>
          <br />
          <br />
        </header>
        <main>{children}</main>
        <footer>=== Root Layout Footer ===</footer>
      </body>
    </html>
  );
}
