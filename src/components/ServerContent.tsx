export default async function ServerContent() {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts/1").then(
    (result) => result.json(),
  );

  return <p>서버에서 가져온 제목 : {data.title}</p>;
}
