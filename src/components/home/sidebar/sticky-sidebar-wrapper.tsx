"use client";

import { useEffect, useRef } from "react";

// Height of the sticky header (h-16 = 64px + h-11 = 44px nav bar ≈ 112px)
const HEADER_HEIGHT = 112;

export function StickySidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastScrollY = window.scrollY;
    let currentTop = HEADER_HEIGHT;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;

      // Maximum top: below the header
      const maxTop = HEADER_HEIGHT;
      // Minimum top: sidebar bottom aligns with viewport bottom
      const minTop = window.innerHeight - el.offsetHeight;

      currentTop = Math.min(maxTop, Math.max(minTop, currentTop - delta));
      el.style.top = `${currentTop}px`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{ top: `${HEADER_HEIGHT}px` }}
      className="hidden lg:sticky lg:flex lg:flex-col lg:gap-8 lg:self-start"
    >
      {children}
    </div>
  );
}
