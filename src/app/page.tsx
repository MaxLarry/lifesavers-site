"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lifesaver from "@/src/image/Lifesavers.png";
import { useState, useEffect } from "react";

export default function Home() {
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
      <div className="flex flex-col justify-center min-h-full py-5 gap-3 my-auto px-4 sm:px-6 lg:px-5">
        <div className="flex flex-col justify-center items-center text-center gap-2">
          <h1 className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white via-yellow-300 via-white to-yellow-500">
  Lifesaver&apos;s
</h1>

          <p className="small">
            Need a drug test for enrollment or org requirements?
            Lifesaver&apos;s got you. Fast bookings, chill vibe, and results you
            can trust.
          </p>
        </div>
        <div className="flex justify-center">
          {" "}
          <Link className=" button button-link non-prim gap-2" href="/book">
            <Button className="rounded-full w-48 h-12">Book Now!</Button>
          </Link>
        </div>
      </div>
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
