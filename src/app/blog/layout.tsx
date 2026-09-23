export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>*** Blog Layout Header ***</header>
      {children}
      <footer>*** Blog Layout Footer ***</footer>
    </div>
  );
}
