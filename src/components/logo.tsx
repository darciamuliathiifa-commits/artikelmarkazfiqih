import Image from "next/image";

const LOGO_ASPECT_RATIO = 768 / 389;

export function Logo({
  variant = "red",
  height = 36,
  className,
  priority = false,
}: {
  variant?: "red" | "white";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "red" ? "/logo-red.png" : "/logo-white.png";
  const width = Math.round(height * LOGO_ASPECT_RATIO);

  return (
    <Image
      src={src}
      alt="Markaz Fiqih"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
