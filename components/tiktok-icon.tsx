import type React from "react"

export function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M15 8v8a4 4 0 0 1-4 4" />
      <line x1="15" y1="4" x2="15" y2="12" />
    </svg>
  )
}
