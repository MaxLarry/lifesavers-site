"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

const TermsCondition = () => {
  return (
    <div className="flex justify-center min-h-full py-9 my-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col bg-cyan-900/25 shadow-lg rounded-2xl w-full sm:max-w-screen-lg lg:p-9 p-6 space-y-8">
        <div className="w-full ">
          <h2 className="text-center">
            Lifesaver&apos;s Booking Scheduler – Terms and Conditions
          </h2>
        </div>
        <Separator orientation="horizontal" />
        <div className=" w-full ">
          <p className="mt-5 font-bold">1. Booking Appointments</p>
          <p className="small">
            1.1 Appointments are available based on open time slots shown in the
            system.
            <br />
            1.2 You must provide accurate and complete information when booking.
            <br />
            1.3 Once confirmed, bookings cannot be canceled or rescheduled.{" "}
          </p>

          <p className="mt-5 font-bold">2. Arrival Policy</p>
          <p className="small">
            2.1 You must arrive on the same date and exact time as your
            scheduled booking.
            <br />
            2.2 Arriving on time gives you priority in processing.
            <br />
            2.3 If you fail to arrive on time, your slot may be given to someone
            else, and you will need to book again.
          </p>

          <p className="mt-5 font-bold">3. No Cancellation or Rescheduling</p>
          <p className="small">
            3.1 All bookings are final.
            <br />
            3.2 No cancellations, reschedules will be allowed for
            missed appointments.
          </p>

          <p className="mt-5 font-bold">4. User Responsibilities</p>
          <p className="small">
            4.1 You are responsible for entering correct and updated
            information.
          </p>

          <p className="mt-5 font-bold">5. Privacy</p>
          <p className="small">
            5.1 We collect personal data only for booking and verification
            purposes.
            <br />
            5.2 Your data will not be shared with third parties unless required
            by law.
            <br />
            5.3 All personal information you provide will be automatically
            deleted after your scheduled booking date has passed and you have
            successfully completed your appointment.
          </p>

          <p className="mt-5 font-bold">6. System </p>
          <p className="small">
            6.1 Booking may be paused temporarily for maintenance or system
            updates.
            <br />
            6.2 If your appointment is affected by a system error or issue on
            our end, we will reach out to you.
          </p>

          <p className="mt-5 font-bold">7. Acceptance of Terms</p>
          <p className="small">
            7.1 Booking an appointment means you have read, understood, and
            agreed to all terms listed above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
