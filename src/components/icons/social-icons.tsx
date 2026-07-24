export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.85-1.45-2.04-1.5-3.32h-3.34v13.28c0 1.6-1.3 2.9-2.9 2.9-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9.29 0 .57.04.83.12v-3.4c-.27-.03-.55-.05-.83-.05C5.5 9.65 2.6 12.55 2.6 16.16c0 3.61 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5V9.01a8.16 8.16 0 0 0 4.8 1.54V7.21c-1.05 0-2.05-.34-2.85-.9-.16-.13-.3-.28-.45-.44z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.6 7.2s-.21-1.49-.86-2.14c-.82-.86-1.74-.86-2.16-.91C15.6 4 12 4 12 4h-.01s-3.59 0-6.58.15c-.42.05-1.34.05-2.16.91-.65.65-.86 2.14-.86 2.14S2.18 8.94 2.18 10.68v1.63c0 1.74.21 3.48.21 3.48s.21 1.49.86 2.14c.82.86 1.9.83 2.38.92 1.72.17 7.37.22 7.37.22s3.6-.01 6.59-.16c.42-.06 1.34-.06 2.16-.92.65-.65.86-2.14.86-2.14s.21-1.74.21-3.48v-1.63c0-1.74-.21-3.48-.21-3.48ZM9.98 14.6V8.79l5.6 2.91-5.6 2.9Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.91v2.19H7.99v2.96h2.47V21h3.04Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
