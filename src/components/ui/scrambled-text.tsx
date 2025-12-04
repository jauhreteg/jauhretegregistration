"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface ScrambledTextProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  style?: React.CSSProperties;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  children,
  className = "",
  radius = 120,
  duration = 1,
  speed = 0.6,
  scrambleChars = "!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  style = {},
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [scrambledText, setScrambledText] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number>();
  const textContent = children?.toString() || "";

  const getRandomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const calculateDistance = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    []
  );

  const scrambleNearbyChars = useCallback(() => {
    if (!containerRef.current || !isHovered) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const charWidth = containerRect.width / textContent.length;

    const newText = textContent
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";

        const charX = containerRect.left + index * charWidth + charWidth / 2;
        const charY = containerRect.top + containerRect.height / 2;

        const distance = calculateDistance(
          mousePos.x,
          mousePos.y,
          charX,
          charY
        );

        if (distance < radius) {
          const intensity = 1 - distance / radius;
          if (Math.random() < intensity * speed) {
            return getRandomChar();
          }
        }

        return char;
      })
      .join("");

    setScrambledText(newText);
  }, [
    textContent,
    mousePos,
    radius,
    speed,
    isHovered,
    calculateDistance,
    getRandomChar,
  ]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setScrambledText(textContent);
  }, [textContent]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Immediately reset to original text
    setScrambledText(textContent);
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [textContent]);

  useEffect(() => {
    if (isHovered) {
      const animate = () => {
        scrambleNearbyChars();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Immediately stop animation and reset text when not hovered
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setScrambledText(textContent);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, scrambleNearbyChars, textContent]);

  useEffect(() => {
    setScrambledText(textContent);
  }, [textContent]);

  return (
    <span
      ref={containerRef}
      className={`inline-block cursor-default ${className}`}
      style={{
        fontFamily: "monospace",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {scrambledText || textContent}
    </span>
  );
};

export default ScrambledText;
