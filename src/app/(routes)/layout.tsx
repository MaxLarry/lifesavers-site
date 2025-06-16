"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lifesaver from "@/src/image/Lifesavers.png";
import { useState, useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full lg:py-6 px-6 py-4 flex justify-center">
        <Link href="/" className="">
          <Image
            src={Lifesaver}
            width={60}
            height={50}
            alt="lrry logo"
            loading="lazy"
            className="flex justify-center items-center gap-4"
          ></Image>
        </Link>
      </div>
      {children}
      <div className="w-full lg:py-6 px-6 py-4 flex justify-center">
        <p className="small">
          {year ?? "..."} &copy; All Rights Reserved, Lifesaver&apos;s
        </p>
      </div>
    </div>
  );
}
