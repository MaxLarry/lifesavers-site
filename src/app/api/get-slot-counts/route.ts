import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("booking_counts")
    .select("time, count")
    .eq("date", date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const fullSlots = data
    .filter((slot) => slot.count >= 50)
    .map((slot) => slot.time);

  return NextResponse.json({ fullSlots });
}
