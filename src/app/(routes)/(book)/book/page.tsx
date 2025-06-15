"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import Cookies from "js-cookie";

const Book = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);

  const availableDates = [
    new Date(2025, 5, 20),
    new Date(2025, 5, 22),
    new Date(2025, 5, 23),
    new Date(2025, 5, 25),
  ];

  const availableTimes = [
    "9:00 - 10:00 AM",
    "10:00 - 11:00 AM",
    "11:00 - 12:00 AM",
    "1:00 - 2:00 PM",
    "2:00 - 3:00 PM",
    "3:00 - 4:00 PM",
  ];

  const isDateAvailable = (date: Date) =>
    availableDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

  const formattedDate = date && format(date, "EEEE, MMMM do");

  // Load saved date/time from cookies on first load
  useEffect(() => {
    const savedDate = Cookies.get("selectedDate");
    const savedTime = Cookies.get("selectedTime");

    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (isDateAvailable(parsedDate)) {
        setDate(parsedDate);
      }
    }

    if (savedTime && availableTimes.includes(savedTime)) {
      setTime(savedTime);
    }
  }, []);

  return (
    <div className="flex justify-center min-h-full py-9 my-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row bg-cyan-900 shadow-lg rounded-2xl border border-rose-950 w-full sm:max-w-screen-lg ">
        <div className="lg:p-9 p-6 lg:w-xl">
          <h2 className="uppercase">Lifesaver&apos;s</h2>
          <p className="small text-white/45 mt-6">
            Please choose a Date and Time.
          </p>
        </div>
        <div className="w-full lg:p-9 p-6">
          {!date ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setTime(null);
                Cookies.remove("selectedTime");
              }}
              modifiers={{ available: availableDates }}
              modifiersClassNames={{ available: "border-2 border-red-500" }}
              disabled={(d) => !isDateAvailable(d)}
              className="rounded-3xl border shadow-sm w-full"
            />
          ) : (
            <div className="bg-background rounded-2xl flex flex-col gap-4 w-full lg:p-9 p-6">
              <p className="text-lg text-white font-semibold text-center">
                {formattedDate}
              </p>

              <div className="flex flex-col gap-2 items-center">
                {availableTimes.map((t) => (
                  <Link
                    key={t}
                    href="/confirm"
                    className="button button-link non-prim gap-2"
                  >
                    <Button
                      className={`w-44 text-lg rounded-full p-6 hover:bg-red-900/40 ${
                        time === t
                          ? "bg-red-600 text-white"
                          : "bg-transparent text-white border border-red-900"
                      }`}
                      onClick={() => {
                        setTime(t);
                        if (date) {
                          Cookies.set("selectedDate", date.toISOString());
                          Cookies.set("selectedTime", t);
                        }
                      }}
                    >
                      {t}
                    </Button>
                  </Link>
                ))}
              </div>

              <a
                onClick={() => {
                  setDate(undefined);
                  setTime(null);
                  Cookies.remove("selectedDate");
                  Cookies.remove("selectedTime");
                }}
                className="hover:underline justify-center text-center cursor-pointer text-white"
              >
                Choose another date
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
