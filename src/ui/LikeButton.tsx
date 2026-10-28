"use client";

import { useState } from "react";

export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleClick = () => {
    setIsLiking(true);
    setCount((prev) => prev + 1);

    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <button onClick={handleClick} disabled={isLiking} aria-pressed={false}>
      👍 {count}
    </button>
  );
}
