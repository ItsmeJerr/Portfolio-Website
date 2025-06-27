import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";

const STAR_COUNT = 40;
const STAR_COLORS = {
  light: "#facc15", // kuning gold untuk mode terang
  dark: "#fffbe9", // putih kekuningan untuk mode gelap
};
const STAR_MIN_SIZE = 14;
const STAR_MAX_SIZE = 28;
const STAR_MIN_SPEED = 0.3;
const STAR_MAX_SPEED = 0.8;
const REPEL_RADIUS = 80; // px
const REPEL_FORCE = 2.2; // multiplier

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// SVG bintang 5 sudut
function StarSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <polygon
        points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9"
        stroke="none"
      />
    </svg>
  );
}

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  dx: number;
  dy: number;
};

export const FlyingStarsBackground: React.FC = () => {
  const { theme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Inisialisasi bintang
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newStars: Star[] = Array.from({ length: STAR_COUNT }).map(() => {
      const angle = random(0, 2 * Math.PI);
      const speed = random(STAR_MIN_SPEED, STAR_MAX_SPEED);
      return {
        x: random(0, width),
        y: random(0, height),
        size: random(STAR_MIN_SIZE, STAR_MAX_SIZE),
        opacity: random(0.5, 0.9),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
      };
    });
    setStars(newStars);
    // eslint-disable-next-line
  }, []);

  // Animasi dan interaksi
  useEffect(() => {
    function animate() {
      setStars((prevStars) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return prevStars.map((star) => {
          let { x, y, dx, dy } = star;

          // Interaksi repel dengan mouse
          const dist = Math.hypot(mouse.current.x - x, mouse.current.y - y);
          if (dist < REPEL_RADIUS) {
            const angle = Math.atan2(y - mouse.current.y, x - mouse.current.x);
            dx += Math.cos(angle) * REPEL_FORCE * 0.1;
            dy += Math.sin(angle) * REPEL_FORCE * 0.1;
          }

          // Tambahkan jitter random kecil agar tidak pernah diam
          dx += random(-0.03, 0.03);
          dy += random(-0.03, 0.03);

          // Update posisi
          x += dx;
          y += dy;

          // Bounce di tepi layar
          if (x < 0 || x > width) dx = -dx;
          if (y < 0 || y > height) dy = -dy;

          // Wrap jika keluar layar (opsional, biar tidak stuck)
          x = Math.max(0, Math.min(x, width));
          y = Math.max(0, Math.min(y, height));

          // Friction lebih kecil agar tidak cepat melambat
          dx *= 0.995;
          dy *= 0.995;

          // Pastikan tidak benar-benar diam
          if (Math.abs(dx) < 0.05) dx += random(-0.07, 0.07);
          if (Math.abs(dy) < 0.05) dy += random(-0.07, 0.07);

          return { ...star, x, y, dx, dy };
        });
      });
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => animRef.current && cancelAnimationFrame(animRef.current);
  }, []);

  // Mouse move event
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      mouse.current.x = e.clientX - (rect?.left || 0);
      mouse.current.y = e.clientY - (rect?.top || 0);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{ width: "100vw", height: "100vh" }}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            transition: "none",
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        >
          <StarSVG
            size={star.size}
            color={theme === "dark" ? STAR_COLORS.dark : STAR_COLORS.light}
          />
        </span>
      ))}
    </div>
  );
};
