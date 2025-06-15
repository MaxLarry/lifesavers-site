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
      <motion.div
        initial={{ y: -50, opacity: 0 }} // Start position above screen
        animate={{ y: 0, opacity: 1 }} // Animate to normal position
        transition={{ type: "spring", stiffness: 20, damping: 10 }}
        className="w-full lg:py-6 px-6 py-4 flex justify-center"
      >
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
      </motion.div>
      {children}
      <motion.div
        initial={{ y: 50, opacity: 0 }} // Start position above screen
        animate={{ y: 0, opacity: 1 }} // Animate to normal position
        transition={{ type: "spring", stiffness: 20, damping: 10 }}
        className="w-full lg:py-6 px-6 py-4 flex justify-center"
      >
        <p className="small">
          {year ?? "..."} &copy; All Rights Reserved, Lifesaver&apos;s
        </p>
      </motion.div>
    </div>
  );
}
