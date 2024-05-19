"use client";
import React from "react";

export default function ErrorComponent({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold">{message}</h1>
      <p
        className="cursor-pointer text-2xl font-bold text-blue-500 underline"
        onClick={() => window.history.back()}
      >
        Go back
      </p>
    </div>
  );
}
