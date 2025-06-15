"use client"

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-28 h-28 border-8 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
