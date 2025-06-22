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
      phoneNumber,
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
        phoneNumber,
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
      phoneNumber,
      email,
      date,
      time,
    ]);

    return NextResponse.json(
      { message: "Booking successful" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";
// import { supabase } from "@/src/lib/supabaseClient";
// import { appendToSheet } from "@/src/lib/googleSheets";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       firstName,
//       lastName,
//       middleName,
//       suffix,
//       campusProgram,
//       yearLevel,
//       phoneNumber,
//       email,
//       date,
//       time,
//     } = body;

//     if (!date || !time) {
//       return NextResponse.json(
//         { error: "Missing date or time" },
//         { status: 400 }
//       );
//     }
//     // Check booking count
//     const { data: countRow, error: countError } = await supabase
//       .from("booking_counts")
//       .select("count")
//       .eq("date", date)
//       .eq("time", time)
//       .single();

//     if (countError && countError.code !== "PGRST116") {
//       console.log("error2");
//       return NextResponse.json({ error: countError.message }, { status: 500 });
//     }

//     const currentCount = countRow?.count || 0;

//     const { error: insertError } = await supabase.from("bookings").insert([
//       {
//         firstName,
//         lastName,
//         middleName: middleName || null,
//         suffix: suffix || null,
//         campus: campusProgram,
//         yearLevelProgram: yearLevel,
//         phoneNumber,
//         email,
//         date,
//         time,
//       },
//     ]);

//     if (insertError) {
//       console.log("error3");
//       return NextResponse.json({ error: insertError.message }, { status: 500 });
//     }

//     // Upsert booking_counts
//     const { error: upsertError } = await supabase
//       .from("booking_counts")
//       .upsert([{ date, time, count: currentCount + 1 }], {
//         onConflict: "date,time",
//       });

//     if (upsertError) {
//       console.log("error4");
//       return NextResponse.json({ error: upsertError.message }, { status: 500 });
//     }

//     try {
//       await appendToSheet([
//         firstName,
//         lastName,
//         middleName || "",
//         suffix || "",
//         campusProgram,
//         yearLevel,
//         phoneNumber,
//         email,
//         date,
//         time,
//       ]);
//     } catch (sheetError) {
//       console.error("Google Sheet error:", sheetError);
//       return NextResponse.json(
//         { error: "Failed to write to Google Sheet" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Booking successful" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Server error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
