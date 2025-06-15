"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const Confirm = () => {
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const cookieDate = Cookies.get("selectedDate");
    const cookieTime = Cookies.get("selectedTime");

    if (cookieDate) {
      const parsedDate = new Date(cookieDate);
      setDate(format(parsedDate, "EEEE, MMMM do"));
    }

    if (cookieTime) {
      setTime(cookieTime);
    }
  }, []);

  return (
    <div className="flex justify-center min-h-full py-9 my-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row bg-cyan-900 shadow-lg rounded-2xl border border-rose-950 w-full sm:max-w-screen-lg">
        <div className="lg:p-9 p-6 lg:w-xl">
          <h2 className="uppercase">Lifesaver&apos;s</h2>
          <p className="small text-white/45 mt-6">Confirm your Booking.</p>
          <div className="border rounded-2xl border-black/30 bg-background text-white p-4 mt-4 ">
            <p className="medium">
              <strong>Date:</strong> {date || "No date selected"}
            </p>
            <p className="medium">
              <strong>Time:</strong> {time || "No time selected"}
            </p>
          </div>
        </div>

        <div className="w-full lg:p-9 py-6 px-6 pt-0">
          <div className="border bg-background rounded-2xl lg:rounded-3xl min-h-96 p-6 lg:p-8">
            <h2 className="medium text-center mb-5">Fill up your Info.</h2>
            <Separator orientation="horizontal"></Separator>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
