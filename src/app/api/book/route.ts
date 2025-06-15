// app/api/insert-booking/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, ...otherFields } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Missing date or time" },
        { status: 400 }
      );
    }

    // Check current count for the selected slot
    const { data: countRow, error: countError } = await supabase
      .from("booking_counts")
      .select("count")
      .eq("date", date)
      .eq("time", time)
      .single();

    if (countError && countError.code !== "PGRST116") {
      // Ignore "no rows found" error
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const currentCount = countRow?.count || 0;

    if (currentCount >= 41) {
      return NextResponse.json({ error: "Slot full" }, { status: 400 });
    }

    // Insert booking
    const { error: insertError } = await supabase
      .from("bookings")
      .insert({ date, time, ...otherFields });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update or insert count
    const { error: upsertError } = await supabase
      .from("booking_counts")
      .upsert([{ date, time, count: currentCount + 1 }], {
        onConflict: "date,time",
      });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Booking successful" });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
