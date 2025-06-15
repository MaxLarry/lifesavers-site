"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // for App Router
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

const Book = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [disabledTimes, setDisabledTimes] = useState<string[]>([]);
  const router = useRouter();

  const availableDates = [
    new Date(2025, 5, 11),
    new Date(2025, 5, 12),
    new Date(2025, 5, 17),
    new Date(2025, 5, 16),
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

  const isDateAvailable = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Midnight today
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const isNotPast = inputDate >= now;

    return (
      isNotPast &&
      availableDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      )
    );
  };

  const isTimeInPast = (timeStr: string, selectedDate: Date): boolean => {
    const now = new Date();

    // Skip if not today
    if (
      selectedDate.getDate() !== now.getDate() ||
      selectedDate.getMonth() !== now.getMonth() ||
      selectedDate.getFullYear() !== now.getFullYear()
    ) {
      return false;
    }

    // Extract start time and period properly
    const [startTime] = timeStr.split(" "); // "1:00", "-", "2:00", "PM" → [ '1:00', '-', '2:00', 'PM' ] is common format
    const [hourStr, minuteStr] = startTime.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // Get actual period (could be at index 3 depending on formatting)
    const ampm = timeStr.includes("PM") ? "PM" : "AM";

    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, minute, 0, 0);

    return slotTime <= now;
  };

  const formattedDate = date && format(date, "EEEE, MMMM do");

  // Load saved date/time from cookies on first load
  useEffect(() => {
    const savedDate = Cookies.get("selectedDate");
    const savedTime = Cookies.get("selectedTime");

    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (isDateAvailable(parsedDate)) {
        setDate(parsedDate);
        fetchDisabledTimes(parsedDate);
      }
    }

    if (savedTime && availableTimes.includes(savedTime)) {
      setTime(savedTime);
    }
  }, [availableTimes, isDateAvailable]);

  const fetchDisabledTimes = async (date: Date) => {
    if (!date) return;

    const beingCheckDate = format(date, "yyyy-MM-dd");
    setLoading(true);
    setDisabledTimes([]);

    try {
      const res = await fetch(`/api/get-slot-counts?date=${beingCheckDate}`);
      const result = await res.json();
      if (res.ok) {
        setDisabledTimes(result.fullSlots || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center min-h-full py-9 my-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row bg-cyan-900 shadow-lg rounded-2xl w-full sm:max-w-screen-lg ">
        <div className="lg:p-9 p-6 lg:w-xl">
            <div className="flex mb-7">
              <div
                onClick={() => {
                  Cookies.remove("selectedTime");
                  router.back();
                }}
                className="cursor-pointer flex py-1 px-3 rounded-2xl items-center gap-3 border border-red-700 bg-black/50"
              >
                <ArrowLeft />
                <p>Back</p>
              </div>
            </div>
          <h2 className="uppercase">Lifesaver&apos;s</h2>
          <p className="medium text-white/45 mt-3">
            Please choose a Date and Time.
          </p>
        </div>
        <div className="w-full lg:p-9 p-6">
          {!date ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={async (d) => {
                if (!d) return;
                setDate(d);
                setTime(null);
                Cookies.remove("selectedTime");
                await fetchDisabledTimes(d);
              }}
              modifiers={{
                available: (d) => isDateAvailable(d),
              }}
              modifiersClassNames={{
                available: "border-2 border-red-500",
              }}
              disabled={(d) => !isDateAvailable(d)}
              className="rounded-3xl border shadow-sm w-full"
            />
          ) : (
            <div className="bg-background rounded-2xl flex flex-col gap-4 w-full lg:p-9 p-6">
              <p className="text-lg font-semibold text-center">
                {formattedDate}
              </p>

              <div className="flex flex-col gap-2 items-center">
                {loading ? (
                  <div className="w-full flex flex-col gap-3">
                    <LoadingSpinner />
                    <p className="medium text-center ">
                      Loading available times...
                    </p>
                  </div>
                ) : (
                  availableTimes.map((t) => (
                    <Button
                      key={t}
                      className={`w-44 text-lg rounded-full p-6 hover:bg-red-900/40 ${
                        time === t
                          ? "bg-red-600"
                          : "bg-transparent text-white border border-red-900"
                      }`}
                      disabled={
                        disabledTimes.includes(t) ||
                        (date && isTimeInPast(t, date))
                      }
                      onClick={() => {
                        setTime(t);
                        if (date) {
                          Cookies.set("selectedDate", format(date, "yyyy-MM-dd"));
                          Cookies.set("selectedTime", t);
                          router.push("/confirm"); // Navigate after setting cookies
                        }
                      }}
                    >
                      {t}
                    </Button>
                  ))
                )}
              </div>
              {!loading && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
