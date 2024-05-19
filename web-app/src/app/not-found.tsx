import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold">Page Not Found</h1>
      <Link href="/" className="text-2xl font-bold text-blue-500">
        Go back to home
      </Link>
    </div>
  );
}
