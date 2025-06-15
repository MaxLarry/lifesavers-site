import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabaseClient";
import { appendToSheet } from "@/src/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      middleName,
      suffix,
      campusProgram,
      yearLevel,
      email,
      date,
      time,
    } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Missing date or time" },
        { status: 400 }
      );
    }
    // Check booking count
    const { data: countRow, error: countError } = await supabase
      .from("booking_counts")
      .select("count")
      .eq("date", date)
      .eq("time", time)
      .single();

    if (countError && countError.code !== "PGRST116") {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const currentCount = countRow?.count || 0;

    const { error: insertError } = await supabase.from("bookings").insert([
      {
        firstName,
        lastName,
        middleName: middleName || null,
        suffix: suffix || null,
        campus: campusProgram,
        yearLevelProgram: yearLevel,
        email,
        date,
        time,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Upsert booking_counts
    const { error: upsertError } = await supabase
      .from("booking_counts")
      .upsert([{ date, time, count: currentCount + 1 }], {
        onConflict: "date,time",
      });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    await appendToSheet([
  firstName,
  lastName,
  middleName || "",
  suffix || "",
  campusProgram,
  yearLevel,
  email,
  date,
  time,
]);

    return NextResponse.json(
      { message: "Booking successful" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
