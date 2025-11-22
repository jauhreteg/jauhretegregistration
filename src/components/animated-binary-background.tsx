"use client";

import type React from "react";
import { useMemo, useEffect, useRef } from "react";

interface AnimatedBinaryBackgroundProps {
  textToConvert: string;
  textColor?: string;
  fontSize?: string;
  lineHeight?: string;
  glowColors?: string[];
  glowIntensity?: number;
  glowInterval?: number;
  glowDuration?: number;
  enableRadialFade?: boolean;
}

const textToBinary = (inputText: string): string => {
  return inputText
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
};

const AnimatedBinaryBackground: React.FC<AnimatedBinaryBackgroundProps> = ({
  textToConvert,
  textColor = "rgba(0, 0, 0, 0.05)",
  fontSize = "12px",
  lineHeight = "1.5",
  glowColors = ["rgba(250, 161, 40, 0.7)", "rgba(0, 35, 90, 0.7)"],
  glowIntensity = 10,
  glowInterval = 150,
  glowDuration = 700,
  enableRadialFade = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const binaryLines = useMemo(() => {
    const baseBinary = textToBinary(textToConvert);
    let longSequence = "";
    for (let i = 0; i < 9; i++) {
      longSequence += baseBinary + "     ";
    }

    const numLines = 30;
    // Use deterministic opacity values based on line index to avoid hydration mismatch
    return Array(numLines)
      .fill(null)
      .map((_, lineIndex) => {
        // Create consistent opacity based on line index
        const opacity = 0.4 + ((lineIndex * 7) % 10) * 0.04; // Creates values between 0.4 and 0.76
        return (
          <div
            key={lineIndex}
            className="binary-line"
            style={{
              opacity: opacity,
            }}
          >
            {longSequence.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                className={
                  char === "0" || char === "1" ? "binary-digit" : "binary-space"
                }
              >
                {char}
              </span>
            ))}
          </div>
        );
      });
  }, [textToConvert]);

  useEffect(() => {
    const animationTimeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      const digits = containerRef.current.querySelectorAll(".binary-digit");
      if (digits.length === 0) return;

      const intervalId = setInterval(() => {
        for (let i = 0; i < glowIntensity; i++) {
          const randomIndex = Math.floor(Math.random() * digits.length);
          const randomDigit = digits[randomIndex] as HTMLElement;

          if (randomDigit && !randomDigit.classList.contains("glow-active")) {
            randomDigit.classList.add("glow-active");

            const selectedGlowColor =
              glowColors[Math.floor(Math.random() * glowColors.length)];

            randomDigit.style.color = selectedGlowColor;
            randomDigit.style.textShadow = `0 0 4px ${selectedGlowColor}, 0 0 8px ${selectedGlowColor}`;

            setTimeout(() => {
              randomDigit.classList.remove("glow-active");
              randomDigit.style.color = "";
              randomDigit.style.textShadow = "";
            }, glowDuration);
          }
        }
      }, glowInterval);

      if (containerRef.current) {
        (containerRef.current as any).animationIntervalId = intervalId;
      }
    }, 200);

    return () => {
      clearTimeout(animationTimeoutId);
      if (
        containerRef.current &&
        (containerRef.current as any).animationIntervalId
      ) {
        clearInterval((containerRef.current as any).animationIntervalId);
      }
    };
  }, [binaryLines, glowIntensity, glowInterval, glowDuration, glowColors]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          color: textColor,
          fontSize: fontSize,
          fontFamily: "monospace",
          lineHeight: lineHeight,
          whiteSpace: "nowrap",
          padding: "5px 0",
          ...(enableRadialFade && {
            maskImage:
              "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
          }),
        }}
      >
        {binaryLines}
      </div>
      <style jsx global>{`
        .binary-line {
          overflow: hidden;
          text-align: center;
        }
        .binary-digit {
          transition: color 0.2s ease-out, text-shadow 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBinaryBackground;
