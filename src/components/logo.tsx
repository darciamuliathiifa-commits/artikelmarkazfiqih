import Image from "next/image";

const FULL_LOGO_ASPECT_RATIO = 1024 / 330;
const EMBLEM_ASPECT_RATIO = 439 / 330;
const MOBILE_LOGO_ASPECT_RATIO = 1598 / 485;

export function Logo({
  variant = "red",
  height = 36,
  emblem = false,
  mobile = false,
  className,
  priority = false,
}: {
  variant?: "red" | "white";
  height?: number;
  emblem?: boolean;
  mobile?: boolean;
  className?: string;
  priority?: boolean;
}) {
  let src = variant === "red" ? "/logo-red.png" : "/logo-white.png";
  let aspectRatio = FULL_LOGO_ASPECT_RATIO;

  if (mobile) {
    src = "/logo-mobile.png";
    aspectRatio = MOBILE_LOGO_ASPECT_RATIO;
  } else if (emblem) {
    src = variant === "red" ? "/logo-emblem-red.png" : "/logo-emblem-white.png";
    aspectRatio = EMBLEM_ASPECT_RATIO;
  }

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
