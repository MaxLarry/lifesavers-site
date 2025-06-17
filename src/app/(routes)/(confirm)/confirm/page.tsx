"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/src/components/LoadingSpinner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BookingFormData = z.infer<typeof bookingSchema>;

const bookingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  campusProgram: z.string().min(2, "Campus program is required"),
  yearLevel: z.string().min(2, "Year level/ Program is required"),
  phoneNumber: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(/^\d{11}$/, "Phone number must contain only digits"),
  email: z
    .string()
    .optional()
    .refine((val) => !val || emailRegex.test(val), {
      message: "Enter a valid email address",
    }),
});

const Confirm = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(
    null
  );

  const [isSending, setIsSending] = useState(false);
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      campusProgram: "",
      yearLevel: "",
      phoneNumber: "",
      email: "",
    },
  });
  const onSubmit = async (data: BookingFormData) => {
    setIsSending(true);

    try {
      const selectedDate = Cookies.get("selectedDate");
      const selectedTime = Cookies.get("selectedTime");

      if (!selectedDate || !selectedTime) {
        toast.error("Date and time are missing.");
        setIsSending(false);
        return;
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      // const result = await res.json();

      if (!res.ok) {
        toast.error("Booking failed: Server has a problem");
      } else {
        toast.success("Booking confirmed!, Thank you :)");
        setSubmittedData(data);
        setShowDialog(true);
        form.reset();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const cookieDate = Cookies.get("selectedDate");
    const cookieTime = Cookies.get("selectedTime");

    // Redirect if cookies are missing
    if (!cookieDate || !cookieTime) {
      router.replace("/book"); // 👈 redirect to /book
      return;
    }

    const parsedDate = new Date(cookieDate);
    setDate(format(parsedDate, "EEEE, MMMM do"));
    setTime(cookieTime);
    setLoading(false); // allow rendering
  }, [router]);

  useEffect(() => {
    if (showDialog) {
      Cookies.remove("selectedDate");
      Cookies.remove("selectedTime");

      // Redirect after a short delay so user sees the dialog briefly
      const timer = setTimeout(() => {
        router.push("/");
      }, 60000); // 60 seconds, adjust as needed

      return () => clearTimeout(timer);
    }
  }, [showDialog, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center min-h-full py-9 my-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row bg-cyan-900 shadow-lg rounded-2xl w-full sm:max-w-screen-lg">
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
            <p className="small text-white/45 mt-3">Confirm your Booking.</p>
            <div className="border rounded-2xl border-black/30 bg-background text-white p-4 mt-4 ">
              <p className="medium">
                <strong>Date:</strong> {date || "No date selected"}
              </p>
              <p className="medium">
                <strong>Time:</strong> {time || "No time selected"}
              </p>
            </div>
                      <p className="medium text-white mt-3">
            <span className="text-red-600 font-black">Note: </span>The available
            dates are for <strong>Brooke&apos;s Point</strong> venue only. For updates, please follow
            our{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              className="text-blue-600"
            >
              Facebook page.
            </a>
          </p>
          </div>

          <div className="w-full lg:p-9 py-6 px-6 pt-0">
            <div className="border bg-background rounded-2xl lg:rounded-3xl min-h-96 p-6 lg:p-8">
              <h2 className="medium text-center mb-5">Fill up your Info.</h2>
              <Separator orientation="horizontal"></Separator>
              <div className="w-full mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex gap-8 flex-col lg:flex-row">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              First Name
                              <p className="xsmall text-white/30">(Required)</p>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder=""
                                disabled={isSending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              Last Name
                              <p className="xsmall text-white/30">(Required)</p>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder=""
                                disabled={isSending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-8 flex-col lg:flex-row">
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              Middle Name
                              <span className="xsmall text-white/30">
                                (not just initial)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder=""
                                disabled={isSending}
                              />
                            </FormControl>
                            <FormDescription>
                              <span className="xsmall text-white/30">
                                Please provide your full middle name if
                                available.
                              </span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="suffix"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              Suffix
                              <span className="xsmall text-white/30">
                                (Optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder=""
                                disabled={isSending}
                              />
                            </FormControl>
                            <FormDescription>
                              <span className="xsmall text-white/30">
                                Used to indicate generational titles like Jr.,
                                Sr., II, III, etc.
                              </span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="campusProgram"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Campus
                            <span className="xsmall text-white/30">
                              (Required)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormDescription>
                            <span className="xsmall text-white/30">
                              e.g., <br />
                              PSU-Main Campus <br />
                              PSU-Taytay Campus <br />
                              PSU-Roxas Campus
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    <FormField
                      control={form.control}
                      name="yearLevel"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Year Level / Program
                            <span className="xsmall text-white/30">
                              (Required)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormDescription>
                            <span className="xsmall text-white/30">
                              e.g., <br />
                              3rd year-BSBA-MM
                              <br />
                              4th year-BSIT
                              <br />
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Phone number
                            <p className="xsmall text-white/30">(Required)</p>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder=""
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="lifesavers.drugtest@booking.com"
                              disabled={isSending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        className="mt-1"
                        disabled={isSending}
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm text-white"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          className="underline text-blue-300/50"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                    <div className="">
                      <Button
                        disabled={!agreed || isSending}
                        className="w-full mt-6"
                      >
                        {isSending && (
                          <div className="w-5 h-5 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                        )}
                        {isSending ? "Sending..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
      {showDialog && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-black border-t-8 border-amber-500">
            <h2 className="text-center font-semibold mb-3">
              Booking Confirmed
            </h2>
            <p className="medium mb-2 text-center">
              🎉 Thank you for booking with Lifesaver&apos;s!
            </p>
            <p className="small text-center text-muted-foreground mb-4">
              You&apos;re all set. Make sure to{" "}
              <strong className="uppercase">take a screenshot</strong> of this
              confirmation. Show it at the venue to secure your{" "}
              <span className="text-blue-600 font-semibold">priority spot</span>{" "}
              at your selected time. Don&apos;t ghost your booking — we&apos;re
              counting on you! 😎 <br />
              <span className="font-medium text-black">
                Please bring a valid ID for verification purposes. <br />
                Thank you.
              </span>
            </p>
            <Separator
              orientation="horizontal"
              className="bg-black/55"
            ></Separator>
            <div className="space-y-1 mt-6">
              <p className="small">
                <strong>Name:</strong> {submittedData.firstName}{" "}
                {submittedData.middleName || ""} {submittedData.lastName}{" "}
                {submittedData.suffix || ""}
              </p>
              <p className="small">
                <strong>Contact:</strong> {submittedData.phoneNumber}
              </p>
              {submittedData.email && (
                <p className="small">
                  <strong>Email:</strong> {submittedData.email}
                </p>
              )}
              <p className="small">
                <strong>Campus:</strong> {submittedData.campusProgram}
              </p>
              <p className="small">
                <strong>Year Level / Program:</strong> {submittedData.yearLevel}
              </p>
              <p className="small">
                <strong>Date:</strong> {date}
              </p>
              <p className="small">
                <strong>Time:</strong> {time}
              </p>
            </div>
            <div className="mt-4 text-right">
              <Button
                onClick={() => {
                  setShowDialog(false);
                  Cookies.remove("selectedDate");
                  Cookies.remove("selectedTime");
                  router.push("/");
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Confirm;
