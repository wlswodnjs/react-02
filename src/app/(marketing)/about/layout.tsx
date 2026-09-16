export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>About Layout Header</header>
      {children}
      <footer>About Layout Footer</footer>
    </div>
  );
}
