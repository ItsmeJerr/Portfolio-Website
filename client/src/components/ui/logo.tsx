import * as React from "react";

export function Logo({
  className = "",
  size = 100,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/logo.png"
      alt="Logo MBALFFAJRY"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{
        maxWidth: "180px",
        maxHeight: size,
        width: "100%",
        height: "auto",
      }}
      draggable={false}
    />
  );
}
