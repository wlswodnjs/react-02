"use client";

import "./Gallery.css";
import { Carousel } from "acme-carousel";

export default function Gallery() {
  const items = [
    {
      id: "1",
      src: "https://picsum.photos/id/1015/800/600",
      alt: "Landscape 1",
    },
    {
      id: "2",
      src: "https://picsum.photos/id/1015/800/600",
      alt: "Landscape 2",
    },
    {
      id: "3",
      src: "https://picsum.photos/id/1015/800/600",
      alt: "Landscape 3",
    },
  ];

  return (
    <div>
      <Carousel
        items={items}
        autoplay={{
          enabled: true,
          interval: 2000,
          pauseOnHover: true,
        }}
        infinite={true}
      />
    </div>
  );
}
