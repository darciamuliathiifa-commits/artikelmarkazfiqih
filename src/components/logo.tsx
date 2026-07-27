import Image from "next/image";

const FULL_LOGO_ASPECT_RATIO = 1024 / 330;
const EMBLEM_ASPECT_RATIO = 439 / 330;

export function Logo({
  variant = "red",
  height = 36,
  emblem = false,
  className,
  priority = false,
}: {
  variant?: "red" | "white";
  height?: number;
  emblem?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const src = emblem
    ? variant === "red"
      ? "/logo-emblem-red.png"
      : "/logo-emblem-white.png"
    : variant === "red"
      ? "/logo-red.png"
      : "/logo-white.png";

  const aspectRatio = emblem ? EMBLEM_ASPECT_RATIO : FULL_LOGO_ASPECT_RATIO;
  const width = Math.round(height * aspectRatio);

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
