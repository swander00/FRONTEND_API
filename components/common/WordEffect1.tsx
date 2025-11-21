"use client";
import { useState, useEffect } from "react";

type WordEffect1Props = {
  string: string[];
};

export default function WordEffect1({ string }: WordEffect1Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (string.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % string.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [string.length]);

  return (
    <span className="inline-block">
      {string.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ${
            index === currentIndex
              ? "opacity-100 translate-y-0"
              : "opacity-0 absolute translate-y-4"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}


